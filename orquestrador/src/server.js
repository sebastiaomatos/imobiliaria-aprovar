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
import { iniciarWorker } from './worker.js';
import { processarWebhookZapi } from './handlers/zapiWebhook.js';

const isProduction = process.env.NODE_ENV === 'production';

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

  // --- 2) Instancia o Fastify ---
  const app = Fastify({ logger: { level: process.env.LOG_LEVEL || 'info' } });
  await app.register(sensible);

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
  app.post('/webhook/zapi', async (request, reply) => {
    processarWebhookZapi(request.body, request.log).catch((err) =>
      request.log.error(`[server] erro no processamento async do /webhook/zapi: ${err?.message || err}`),
    );
    return reply.code(200).send({ received: true });
  });

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
