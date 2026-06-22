// db.js — acesso ao PostgreSQL (pool do pg) e criação das tabelas.
//
// Conecta via DATABASE_URL (injetada pelo Railway ao adicionar o plugin Postgres).
// O pool é único por processo e criado de forma preguiçosa (lazy), para o módulo
// poder ser importado mesmo antes de o dotenv popular o ambiente.

import pg from 'pg';

const { Pool } = pg;

/** @type {import('pg').Pool | null} */
let pool = null;

/**
 * Define o uso de SSL conforme o destino. Provedores gerenciados (Railway etc.)
 * exigem SSL com rejectUnauthorized:false; um Postgres local normalmente não tem
 * SSL — por isso desligamos para localhost (defensivo, permite rodar localmente).
 */
function sslConfig() {
  const url = process.env.DATABASE_URL || '';
  if (/@(localhost|127\.0\.0\.1)[:/]/.test(url) || /\bsslmode=disable\b/.test(url)) {
    return false;
  }
  return { rejectUnauthorized: false };
}

/** Retorna o pool (criando na primeira chamada). */
export function getPool() {
  if (!pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL não definida — banco indisponível.');
    }
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: sslConfig(),
    });
    // Erros do pool não devem derrubar o processo.
    pool.on('error', (err) => {
      console.error('[db] erro inesperado no pool:', err?.message || err);
    });
  }
  return pool;
}

/** Cria as tabelas se não existirem. Chamado na subida do servidor. */
export async function initDb() {
  const p = getPool();
  await p.query(`
    CREATE TABLE IF NOT EXISTS leads (
      id serial PRIMARY KEY,
      phone text UNIQUE,
      nome text,
      origem text,
      intencao text,
      pagamento text,
      estagio text DEFAULT 'novo',
      prioridade boolean DEFAULT false,
      optout boolean DEFAULT false,
      fonte text,
      consentimento_em timestamptz,
      criado_em timestamptz DEFAULT now(),
      atualizado_em timestamptz DEFAULT now()
    );
  `);
  // Migração defensiva: garante as colunas novas em bancos já existentes.
  await p.query(`ALTER TABLE leads ADD COLUMN IF NOT EXISTS fonte text;`);
  await p.query(`ALTER TABLE leads ADD COLUMN IF NOT EXISTS consentimento_em timestamptz;`);
  await p.query(`
    CREATE TABLE IF NOT EXISTS agendamentos (
      id serial PRIMARY KEY,
      lead_phone text,
      etapa text,
      enviar_em timestamptz,
      status text DEFAULT 'pendente',
      criado_em timestamptz DEFAULT now()
    );
  `);
  await p.query(`
    CREATE TABLE IF NOT EXISTS eventos (
      id serial PRIMARY KEY,
      lead_phone text,
      tipo text,
      payload jsonb,
      criado_em timestamptz DEFAULT now()
    );
  `);
  // Idempotência: registra os messageId já processados do webhook da Z-API.
  await p.query(`
    CREATE TABLE IF NOT EXISTS mensagens_processadas (
      message_id text PRIMARY KEY,
      criado_em timestamptz DEFAULT now()
    );
  `);
  // Índice que acelera a varredura do worker (status + horário de envio).
  await p.query(`CREATE INDEX IF NOT EXISTS idx_agendamentos_due ON agendamentos (status, enviar_em);`);
  console.log('[db] tabelas/índices verificados: leads, agendamentos, eventos, mensagens_processadas.');
}

/** Busca um lead pelo telefone (ou null). */
export async function getLeadByPhone(phone) {
  const { rows } = await getPool().query('SELECT * FROM leads WHERE phone = $1', [phone]);
  return rows[0] || null;
}

/** Cria um lead. Se já existir (corrida), não duplica e devolve o existente. */
export async function createLead(dados) {
  const {
    phone,
    nome = null,
    origem = null,
    intencao = null,
    pagamento = null,
    estagio = 'novo',
    fonte = null,
    consentimentoEm = null,
  } = dados || {};
  const { rows } = await getPool().query(
    `INSERT INTO leads (phone, nome, origem, intencao, pagamento, estagio, fonte, consentimento_em)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     ON CONFLICT (phone) DO UPDATE SET
       atualizado_em = now(),
       fonte = COALESCE(leads.fonte, EXCLUDED.fonte),
       consentimento_em = COALESCE(leads.consentimento_em, EXCLUDED.consentimento_em)
     RETURNING *`,
    [phone, nome, origem, intencao, pagamento, estagio, fonte, consentimentoEm],
  );
  return rows[0];
}

/** Atualiza apenas os campos informados (ignora indefinidos). */
export async function updateLead(phone, campos) {
  const permitidos = ['nome', 'origem', 'intencao', 'pagamento', 'estagio', 'prioridade', 'optout', 'fonte', 'consentimento_em'];
  const sets = [];
  const valores = [];
  let i = 1;
  for (const chave of permitidos) {
    if (campos && campos[chave] !== undefined) {
      sets.push(`${chave} = $${i++}`);
      valores.push(campos[chave]);
    }
  }
  if (sets.length === 0) return getLeadByPhone(phone); // nada a atualizar
  sets.push('atualizado_em = now()');
  valores.push(phone);
  const { rows } = await getPool().query(
    `UPDATE leads SET ${sets.join(', ')} WHERE phone = $${i} RETURNING *`,
    valores,
  );
  return rows[0] || null;
}

/** Agenda mensagens da régua. lista: [{ etapa, enviar_em }]. */
export async function agendarMensagens(phone, lista) {
  if (!Array.isArray(lista) || lista.length === 0) return;
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    for (const item of lista) {
      await client.query(
        `INSERT INTO agendamentos (lead_phone, etapa, enviar_em) VALUES ($1, $2, $3)`,
        [phone, item.etapa, item.enviar_em],
      );
    }
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    throw err;
  } finally {
    client.release();
  }
}

/** Cancela todos os agendamentos pendentes de um lead. Retorna quantos. */
export async function cancelarAgendamentosPendentes(phone) {
  const { rowCount } = await getPool().query(
    `UPDATE agendamentos SET status = 'cancelado'
     WHERE lead_phone = $1 AND status = 'pendente'`,
    [phone],
  );
  return rowCount;
}

/** Agendamentos pendentes cujo horário já chegou. */
export async function pegarAgendamentosVencidos() {
  const { rows } = await getPool().query(
    `SELECT * FROM agendamentos
     WHERE status = 'pendente' AND enviar_em <= now()
     ORDER BY enviar_em ASC`,
  );
  return rows;
}

/** Marca o status de um agendamento (ex.: 'enviado', 'cancelado', 'erro'). */
export async function marcarAgendamento(id, status) {
  await getPool().query(`UPDATE agendamentos SET status = $1 WHERE id = $2`, [status, id]);
}

/** Registra um evento de auditoria. */
export async function registrarEvento(phone, tipo, payload = {}) {
  await getPool().query(
    `INSERT INTO eventos (lead_phone, tipo, payload) VALUES ($1, $2, $3)`,
    [phone, tipo, JSON.stringify(payload ?? {})],
  );
}

/**
 * Idempotência do webhook: tenta registrar um messageId.
 * @param {string} messageId
 * @returns {Promise<boolean>} true se é NOVO (deve processar); false se já visto.
 */
export async function registrarMensagemProcessada(messageId) {
  if (!messageId) return true; // sem id confiável: processa (não bloqueia)
  const { rowCount } = await getPool().query(
    `INSERT INTO mensagens_processadas (message_id) VALUES ($1)
     ON CONFLICT (message_id) DO NOTHING`,
    [String(messageId)],
  );
  return rowCount > 0;
}

// Idempotência do webhook do Meta Lead Ads: reusa a tabela mensagens_processadas
// com um prefixo de namespace, para não colidir com os messageId da Z-API.
const LEADGEN_PREFIX = 'metalead:';

/**
 * Já processamos este leadgen_id? (consulta, não marca).
 * @param {string} leadgenId
 * @returns {Promise<boolean>}
 */
export async function leadgenJaProcessado(leadgenId) {
  if (!leadgenId) return false;
  const { rowCount } = await getPool().query(
    `SELECT 1 FROM mensagens_processadas WHERE message_id = $1`,
    [LEADGEN_PREFIX + leadgenId],
  );
  return rowCount > 0;
}

/**
 * Marca um leadgen_id como processado (após persistir o lead com sucesso).
 * @param {string} leadgenId
 */
export async function marcarLeadgenProcessado(leadgenId) {
  if (!leadgenId) return;
  await getPool().query(
    `INSERT INTO mensagens_processadas (message_id) VALUES ($1)
     ON CONFLICT (message_id) DO NOTHING`,
    [LEADGEN_PREFIX + leadgenId],
  );
}
