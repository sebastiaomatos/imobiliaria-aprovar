// handlers/metaLeadWebhook.js — lógica do webhook do Meta Lead Ads.
//
// O server.js cuida do roteamento (GET de verificação + POST) e de reter o corpo
// CRU para a assinatura; aqui ficam as funções puras/testáveis:
//   - assinaturaValida(): valida X-Hub-Signature-256 sobre os bytes crus (HMAC).
//   - mapearFieldData(): converte o field_data do Graph no nosso formato de lead.
//   - processarLeadgen(): idempotência → busca no Graph → processa pelo fluxo único.
//
// Injeção de dependências (`opts.deps`) é só para os testes.

import { createHmac, timingSafeEqual } from 'node:crypto';
import * as db from '../db.js';
import * as metaLeads from '../integrations/metaLeads.js';
import { processarLead, normalizarTelefoneBR } from '../services/processarLead.js';

/**
 * Valida a assinatura `X-Hub-Signature-256` sobre o CORPO CRU (bytes), não sobre
 * o JSON reparseado. Compara em tempo constante (timingSafeEqual).
 * @param {Buffer|string} rawBody  bytes crus exatamente como o Meta enviou
 * @param {string} header          valor do header (ex.: "sha256=abcd...")
 * @param {string} appSecret       META_APP_SECRET
 * @returns {boolean}
 */
export function assinaturaValida(rawBody, header, appSecret) {
  if (!appSecret || typeof header !== 'string' || rawBody == null) return false;
  const corpo = Buffer.isBuffer(rawBody) ? rawBody : Buffer.from(String(rawBody), 'utf8');
  const esperado = 'sha256=' + createHmac('sha256', appSecret).update(corpo).digest('hex');
  const a = Buffer.from(header);
  const b = Buffer.from(esperado);
  if (a.length !== b.length) return false; // timingSafeEqual exige mesmo tamanho
  return timingSafeEqual(a, b);
}

/** Primeiro valor não-vazio de um dos campos (busca case-insensitive por nome). */
function pegarValor(fieldData, ...nomes) {
  const lista = Array.isArray(fieldData) ? fieldData : [];
  for (const nome of nomes) {
    if (!nome) continue;
    const alvo = String(nome).toLowerCase();
    const campo = lista.find((c) => String(c?.name || '').toLowerCase() === alvo);
    const valor = campo?.values?.find?.((v) => v != null && String(v).trim() !== '');
    if (valor != null) return String(valor).trim();
  }
  return null;
}

/**
 * Mapeia a resposta do Graph (de um leadgen) para o nosso formato de lead.
 * @param {object} graphData         resposta do GET /{leadgen_id}
 * @param {object} [opts]
 * @param {string} [opts.objetivoKey] chave do campo "objetivo" (de env)
 * @returns {{nome:string|null, telefone:string|null, email:string|null,
 *            intencao:string|null, consentimentoEm:string|null,
 *            adId:string|null, formId:string|null}}
 */
export function mapearFieldData(graphData, opts = {}) {
  const fd = graphData?.field_data || [];
  const objetivoKey = opts.objetivoKey || 'objetivo';

  const fullName = pegarValor(fd, 'full_name');
  const first = pegarValor(fd, 'first_name');
  const last = pegarValor(fd, 'last_name');
  const nome = fullName || [first, last].filter(Boolean).join(' ').trim() || null;

  const telefoneBruto = pegarValor(fd, 'phone_number', 'phone', 'telefone');
  const telefone = telefoneBruto ? normalizarTelefoneBR(telefoneBruto) : null;

  const email = pegarValor(fd, 'email', 'e-mail');

  // Campo "objetivo": chave vinda do env, com fallback gracioso para nomes comuns.
  const intencao = pegarValor(fd, objetivoKey, 'objetivo', 'intencao', 'finalidade');

  // O Instant Form do Meta exige link de política de privacidade para enviar; o
  // próprio envio é o aceite. Registramos created_time como consentimento (LGPD).
  const consentimentoEm = graphData?.created_time
    ? new Date(graphData.created_time).toISOString()
    : null;

  return {
    nome,
    telefone,
    email,
    intencao,
    consentimentoEm,
    adId: graphData?.ad_id || null,
    formId: graphData?.form_id || null,
  };
}

/**
 * Processa UM `value` de leadgen do webhook: idempotência por leadgen_id, busca
 * no Graph, mapeia e roteia pelo fluxo único (processarLead).
 *
 * LANÇA quando a persistência inicial falha ou o Graph não responde — assim o
 * server devolve 500 e o Meta reenvia. Retorna `{duplicate:true}` se já visto.
 *
 * @param {{leadgen_id:string, ad_id?:string, form_id?:string, created_time?:number}} value
 * @param {object} [opts]
 * @param {object} [opts.deps]  injeção p/ testes ({db, metaLeads, processarLead})
 * @param {object} [opts.log]
 */
export async function processarLeadgen(value, opts = {}) {
  const { deps = {}, log = console } = opts;
  const _db = deps.db || db;
  const _metaLeads = deps.metaLeads || metaLeads;
  const _processarLead = deps.processarLead || processarLead;

  const leadgenId = value?.leadgen_id;
  if (!leadgenId) {
    log.warn?.('[meta-lead] change sem leadgen_id — ignorando.');
    return { ignorado: true };
  }

  // 1) Idempotência: já processado → não refaz.
  if (await _db.leadgenJaProcessado(leadgenId)) {
    log.info?.(`[meta-lead] leadgen ${leadgenId} já processado — ignorando reentrega.`);
    return { duplicate: true };
  }

  // 2) Busca os dados do lead no Graph. Falha (token/transiente) → lança (→500).
  const resp = await _metaLeads.buscarLead(leadgenId);
  if (!resp?.ok) {
    throw new Error(`graph_fetch_falhou: ${resp?.erro || resp?.status || 'desconhecido'}`);
  }

  // 3) Mapeia o formulário.
  const objetivoKey = process.env.META_LEAD_FIELD_OBJETIVO || 'objetivo';
  const m = mapearFieldData(resp.data, { objetivoKey });

  if (!m.telefone) {
    // Sem telefone não há como nutrir pelo WhatsApp; ainda assim persistimos o que
    // veio (e-mail/nome) para não perder o lead. Marcamos como processado no fim.
    log.warn?.(`[meta-lead] leadgen ${leadgenId} sem telefone — seguindo com os dados disponíveis.`);
  }

  const meta = {
    leadgenId,
    adId: value?.ad_id || m.adId || null,
    formId: value?.form_id || m.formId || null,
  };
  const mensagemCrm =
    `Lead via Meta Lead Ads (formulário ${meta.formId || '-'}). ` +
    `Objetivo: ${m.intencao || '-'}. ad_id: ${meta.adId || '-'}.`;

  // 4) Fluxo único (persistência + Praedium + Brevo).
  const resultado = await _processarLead(
    {
      nome: m.nome,
      telefone: m.telefone,
      email: m.email,
      intencao: m.intencao,
      origem: 'meta_lead_ads',
      fonte: 'meta_form',
      consentimentoEm: m.consentimentoEm,
      mensagemCrm,
      brevoListId: process.env.BREVO_LIST_ID_VIP,
      meta,
    },
    { log },
  );

  // 5) Se a persistência inicial falhou (ex.: DB fora), lança → 500 → Meta reenvia.
  //    (NÃO marcamos como processado, para o reenvio reprocessar.)
  if (!resultado.persistido) {
    throw new Error(`persistencia_falhou: leadgen ${leadgenId}`);
  }

  // 6) Persistiu → marca idempotência. Downstream (Praedium/Brevo) é best-effort.
  await _db.marcarLeadgenProcessado(leadgenId);
  log.info?.(`[meta-lead] leadgen ${leadgenId} processado (fonte=meta_form).`);
  return { ok: true, telefone: resultado.telefone };
}
