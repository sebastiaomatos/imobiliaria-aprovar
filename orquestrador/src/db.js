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
      criado_em timestamptz DEFAULT now(),
      atualizado_em timestamptz DEFAULT now()
    );
  `);
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
  console.log('[db] tabelas verificadas/criadas: leads, agendamentos, eventos.');
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
  } = dados || {};
  const { rows } = await getPool().query(
    `INSERT INTO leads (phone, nome, origem, intencao, pagamento, estagio)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (phone) DO UPDATE SET atualizado_em = now()
     RETURNING *`,
    [phone, nome, origem, intencao, pagamento, estagio],
  );
  return rows[0];
}

/** Atualiza apenas os campos informados (ignora indefinidos). */
export async function updateLead(phone, campos) {
  const permitidos = ['nome', 'origem', 'intencao', 'pagamento', 'estagio', 'prioridade', 'optout'];
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
  const p = getPool();
  for (const item of lista) {
    await p.query(
      `INSERT INTO agendamentos (lead_phone, etapa, enviar_em) VALUES ($1, $2, $3)`,
      [phone, item.etapa, item.enviar_em],
    );
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
