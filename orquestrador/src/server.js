// server.js — ponto de entrada do orquestrador AQV (Fastify + PostgreSQL).
//
// Recebe eventos do WhatsApp (Z-API) e leads da landing, registra no banco,
// dispara a mensagem inicial (M0), agenda a régua de recuperação (R1..R5) e
// notifica o corretor. A régua é processada por um worker (setInterval 60s).
//
// Em produção (Railway) as variáveis vêm do ambiente do serviço; em dev,
// carregamos o .env via dotenv (devDependency).

import Fastify from 'fastify';
import sensible from '@fastify/sensible';
import { timingSafeEqual } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { loadConfig } from './config.js';
import { initDb } from './db.js';
import * as db from './db.js';
import { iniciarWorker } from './worker.js';
import { processarWebhookZapi } from './handlers/zapiWebhook.js';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import * as praedium from './integrations/praedium.js';
import * as brevo from './integrations/brevo.js';

const isProduction = process.env.NODE_ENV === 'production';

// Idempotência leve do /cadastro: evita leads duplicados por duplo-clique/reenvio.
const cadastroRecente = new Map(); // telefone -> timestamp(ms)
const CADASTRO_TTL_MS = 60 * 1000;

/**
 * Compara dois segredos em tempo constante (mitiga timing attacks).
 * @param {unknown} a @param {unknown} b @returns {boolean}
 */
function secretsMatch(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

async function start() {
  // --- 1) Carrega o .env apenas em desenvolvimento ---
  if (!isProduction) {
    try {
      const dotenv = await import('dotenv');
      const aqui = dirname(fileURLToPath(import.meta.url)); // .../orquestrador/src
      // .env local de orquestrador/ e, como fallback, o .env da raiz do repo.
      dotenv.config({ path: [resolve(aqui, '../.env'), resolve(aqui, '../../.env')] });
    } catch {
      // dotenv ausente (ex.: produção sem devDependencies): segue com o ambiente.
    }
  }

  // --- 2) Instancia o Fastify (trustProxy: IP real do cliente atrás do proxy do Railway) ---
  const app = Fastify({ logger: { level: process.env.LOG_LEVEL || 'info' }, trustProxy: true });
  await app.register(sensible);

  // CORS para o(s) domínio(s) da landing — o POST /cadastro é chamado do browser.
  const allowList = (process.env.CADASTRO_ALLOWED_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (allowList.length === 0) {
    app.log.warn('[cors] CADASTRO_ALLOWED_ORIGINS vazio — CORS aberto a qualquer origem. Defina o domínio da landing em produção.');
  }
  await app.register(cors, {
    origin: allowList.length ? allowList : true, // true = reflete a origem (aberto) até configurar
    methods: ['GET', 'POST', 'OPTIONS'],
  });

  // Rate-limit aplicado por rota (config no /cadastro; global desligado).
  await app.register(rateLimit, { global: false });

  // --- 3) Lê e valida as variáveis (depois de o dotenv popular process.env) ---
  const config = loadConfig(app.log);

  // --- 4) Banco: cria as tabelas. Defensivo: se falhar, loga e segue de pé
  // (o healthcheck continua respondendo; rotas que usam o DB falharão por
  // requisição até a conexão/DATABASE_URL ficarem OK). ---
  try {
    await initDb();
  } catch (err) {
    app.log.error(
      `[server] falha ao inicializar o banco: ${err?.message || err}. ` +
        'Healthcheck segue ativo; rotas que usam o DB vão falhar até regularizar.',
    );
  }

  // --- 5) Rotas ---

  // Healthcheck (Railway + teste manual no navegador).
  app.get('/', async () => {
    return { status: 'ok', service: 'orquestrador-aqv', ts: new Date().toISOString() };
  });

  // Lead vindo da landing (form). Mantido: valida secret e loga.
  app.post('/webhook/lead', async (request, reply) => {
    const segredoRecebido = request.headers['x-webhook-secret'];
    if (!secretsMatch(segredoRecebido, config.WEBHOOK_SECRET)) {
      return reply.code(401).send({
        error: 'unauthorized',
        message: 'Header x-webhook-secret ausente ou inválido.',
      });
    }
    request.log.info({ lead: request.body }, 'Lead recebido em /webhook/lead');
    // TODO(0.7): reaproveitar o fluxo do /webhook/zapi a partir do lead da landing.
    return reply.code(200).send({ received: true });
  });

  // Webhook da Z-API (mensagens do WhatsApp). Responde rápido e processa em
  // background para não estourar o timeout do webhook.
  app.post(
    '/webhook/zapi',
    { config: { rateLimit: { max: 120, timeWindow: '1 minute' } } },
    async (request, reply) => {
      processarWebhookZapi(request.body, request.log).catch((err) =>
        request.log.error(`[server] erro no processamento async do /webhook/zapi: ${err?.message || err}`),
      );
      return reply.code(200).send({ received: true });
    },
  );

  // Cadastro vindo da landing (lista VIP). Público (NÃO exige x-webhook-secret,
  // pois é chamado do browser); protegido por CORS + rate-limit + validação de
  // campos e de origem.
  const cadastroSchema = {
    body: {
      type: 'object',
      required: ['nome', 'telefone'],
      additionalProperties: true, // aceita utm_* e outros campos extras
      properties: {
        nome: { type: 'string', minLength: 2, maxLength: 120 },
        telefone: { type: 'string', minLength: 8, maxLength: 25 },
        email: { type: 'string', maxLength: 160 },
        intencao: { type: 'string', maxLength: 40 },
        empreendimento: { type: 'string', maxLength: 80 },
        lista: { type: 'string', maxLength: 40 },
      },
    },
  };

  app.post(
    '/cadastro',
    {
      schema: cadastroSchema,
      config: { rateLimit: { max: 10, timeWindow: '1 minute' } },
      // Guard de Content-Type ANTES da validação do schema: aceitamos apenas JSON.
      preValidation: async (request, reply) => {
        const ct = String(request.headers['content-type'] || '');
        if (!ct.includes('application/json')) {
          return reply.code(415).send({ ok: false, error: 'content_type_invalido' });
        }
      },
    },
    async (request, reply) => {
      // Validação de origem (além do CORS): com allowlist e Origin presente,
      // recusa se não estiver na lista. Sem Origin (server-to-server/teste), segue.
      const origin = request.headers.origin;
      if (allowList.length && origin && !allowList.includes(origin)) {
        return reply.code(403).send({ ok: false, error: 'origin_not_allowed' });
      }

      const b = request.body || {};
      const nome = String(b.nome || '').trim();
      const telefone = String(b.telefone || '').replace(/\D/g, '');
      const emailRaw = typeof b.email === 'string' ? b.email.trim() : '';
      const emailValido = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(emailRaw);

      if (nome.length < 2 || telefone.length < 8) {
        return reply.code(400).send({ ok: false, error: 'campos_invalidos', detalhe: 'nome e telefone são obrigatórios' });
      }

      // Idempotência leve: mesmo telefone em janela curta → não reprocessa downstream
      // (evita lead duplicado por duplo-clique/reenvio do formulário).
      const agora = Date.now();
      const ultimoEnvio = cadastroRecente.get(telefone);
      if (ultimoEnvio && agora - ultimoEnvio < CADASTRO_TTL_MS) {
        return reply.code(200).send({ ok: true, received: true, duplicado: true });
      }
      cadastroRecente.set(telefone, agora);
      if (cadastroRecente.size > 5000) {
        for (const [k, t] of cadastroRecente) if (agora - t > CADASTRO_TTL_MS) cadastroRecente.delete(k);
      }

      const empreendimento = String(b.empreendimento || 'botanique-residence').slice(0, 80);
      const lista = String(b.lista || 'VIP').slice(0, 40);
      const intencao = b.intencao ? String(b.intencao).slice(0, 40) : null;
      const consentiu = b.consentimento === true || b.consentimento === 'true' || b.consentimento === 'on';

      // Persiste o lead no nosso banco com a fonte e o consentimento (LGPD).
      // Defensivo: se o banco estiver indisponível, não perdemos o lead (segue p/ CRM).
      try {
        await db.createLead({
          phone: telefone,
          nome,
          origem: `landing:${empreendimento}`,
          intencao,
          estagio: 'novo',
          fonte: `landing:${empreendimento}:${lista}`,
          consentimentoEm: consentiu ? new Date().toISOString() : null,
        });
      } catch (err) {
        request.log.warn(`[cadastro] não consegui persistir o lead no banco: ${err?.message || err}`);
      }

      // UTMs e identificadores de origem.
      const utm = {};
      for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid']) {
        if (b[k]) utm[k] = String(b[k]).slice(0, 200);
      }

      // (1) Cria o lead no Praedium (defensivo: pula se não configurado).
      const mensagem = `Cadastro ${lista} via landing (${empreendimento}). Intenção: ${intencao || '-'}. UTM: ${JSON.stringify(utm)}`;
      const praedRes = await praedium.enviarLead({
        nome,
        phone: telefone,
        email: emailValido ? emailRaw : null,
        origem: `landing:${empreendimento}`,
        mensagem,
      });

      // (2) Adiciona à lista VIP do Brevo (lista própria), se houver e-mail válido.
      let brevoRes = { ok: true, pulado: true, motivo: 'sem_email' };
      if (emailValido) {
        brevoRes = await brevo.adicionarContato(emailRaw, nome, process.env.BREVO_LIST_ID_VIP);
      }

      request.log.info(
        { empreendimento, lista, intencao, temEmail: emailValido, utm },
        `[cadastro] lead recebido: ${nome} / ${telefone}`,
      );

      // Sempre 200 (não perdemos o lead mesmo se um downstream estiver indisponível).
      return reply.code(200).send({
        ok: true,
        received: true,
        praedium: praedRes?.ok ?? false,
        brevo: brevoRes?.ok ?? false,
        brevo_pulado: brevoRes?.pulado ?? false,
      });
    },
  );

  // --- 6) Worker da régua de recuperação ---
  iniciarWorker(app.log);

  // --- 7) Sobe o servidor ---
  const port = Number(process.env.PORT) || 3000;
  const host = '0.0.0.0'; // OBRIGATÓRIO no Railway: escutar em todas as interfaces.
  try {
    await app.listen({ port, host });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
