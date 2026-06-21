// server.js — ponto de entrada do orquestrador AQV (Fastify).
//
// Fluxo-alvo (a ser completado no 0.7):
//   landing / Praedium -> POST /webhook/lead -> Praedium -> Z-API (M0) -> Brevo -> Meta CAPI
//
// Em produção (Railway) as variáveis vêm do ambiente do serviço.
// Em desenvolvimento, carregamos o .env via dotenv (devDependency).

import Fastify from 'fastify';
import sensible from '@fastify/sensible';
import { timingSafeEqual } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { loadConfig } from './config.js';

// Integrações (stubs) — serão acionadas no 0.7:
// import { upsertLead } from './integrations/praedium.js';
// import { sendText } from './integrations/zapi.js';
// import { sendTransactionalEmail } from './integrations/brevo.js';
// import { sendConversionEvent } from './integrations/metaCapi.js';

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Compara dois segredos em tempo constante (mitiga timing attacks).
 * Retorna false se algum não for string ou se os tamanhos diferirem.
 * @param {unknown} a
 * @param {unknown} b
 * @returns {boolean}
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
      // Procura o .env local de orquestrador/ e, como fallback, o .env da raiz
      // do repositório (onde o projeto já mantém as variáveis). O primeiro a
      // definir cada chave vence (dotenv não sobrescreve o que já existe).
      dotenv.config({ path: [resolve(aqui, '../.env'), resolve(aqui, '../../.env')] });
    } catch {
      // dotenv ausente (ex.: produção sem devDependencies): seguimos apenas com
      // as variáveis já presentes no ambiente.
    }
  }

  // --- 2) Instancia o Fastify ---
  const app = Fastify({
    logger: { level: process.env.LOG_LEVEL || 'info' },
  });
  await app.register(sensible); // disponibiliza app.httpErrors, app.assert, etc.

  // --- 3) Lê e valida as variáveis (depois de o dotenv popular process.env) ---
  const config = loadConfig(app.log);

  // --- 4) Rotas ---

  // Healthcheck: usado pelo Railway e para teste manual no navegador.
  app.get('/', async () => {
    return { status: 'ok', service: 'orquestrador-aqv', ts: new Date().toISOString() };
  });

  // Recebe leads da landing / do Praedium.
  app.post('/webhook/lead', async (request, reply) => {
    const segredoRecebido = request.headers['x-webhook-secret'];

    // Autenticação por segredo compartilhado (fail-closed: sem WEBHOOK_SECRET
    // configurado, nenhuma chamada é aceita).
    if (!secretsMatch(segredoRecebido, config.WEBHOOK_SECRET)) {
      return reply.code(401).send({
        error: 'unauthorized',
        message: 'Header x-webhook-secret ausente ou inválido.',
      });
    }

    // Por enquanto apenas registra o corpo recebido.
    request.log.info({ lead: request.body }, 'Lead recebido em /webhook/lead');

    // TODO(0.7): orquestrar o fluxo completo a partir do lead:
    //   1. praedium.upsertLead(lead)             -> cria/atualiza o lead no CRM
    //   2. zapi.sendText(...)                     -> dispara a mensagem M0
    //   3. brevo.sendTransactionalEmail(...)      -> e-mail de boas-vindas
    //   4. metaCapi.sendConversionEvent('Lead')   -> evento server-side p/ Meta
    //   (gemini.generatePropertyReport pode enriquecer a copy do imóvel)

    return reply.code(200).send({ received: true });
  });

  // Webhook da Z-API (mensagens/eventos do WhatsApp).
  // Por enquanto: apenas loga o que chega. SEM validação de secret e SEM
  // processamento (vamos endurecer e orquestrar depois).
  app.post('/webhook/zapi', async (request, reply) => {
    const body = request.body ?? {};

    // Corpo COMPLETO, indentado. O payload da Z-API não contém nossos segredos.
    console.log('\n[Z-API webhook] corpo recebido:');
    console.log(JSON.stringify(body, null, 2));

    // Campos em destaque (um por linha), apenas os que vierem preenchidos.
    const texto = body?.text?.message ?? body?.message ?? null;
    const campos = {
      phone: body?.phone,
      senderName: body?.senderName ?? body?.chatName,
      fromMe: body?.fromMe,
      type: body?.type,
      texto,
    };
    for (const [chave, valor] of Object.entries(campos)) {
      if (valor !== undefined && valor !== null) {
        console.log(`[Z-API webhook] ${chave}: ${typeof valor === 'object' ? JSON.stringify(valor) : valor}`);
      }
    }

    // Sempre 200 (não processa nada além de logar, por enquanto).
    return reply.code(200).send({ received: true });
  });

  // --- 5) Sobe o servidor ---
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
