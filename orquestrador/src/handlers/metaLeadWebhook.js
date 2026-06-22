// handlers/metaLeadWebhook.js — lógica do webhook do Meta Lead Ads.
//
// O server.js cuida do roteamento (GET de verificação + POST) e de reter o corpo
// CRU para a assinatura; aqui ficam as funções puras/testáveis:
//   - assinaturaValida(): valida X-Hub-Signature-256 sobre os bytes crus (HMAC).
//   - mapearFieldData(): converte o field_data do Graph no nosso formato de lead.
//   - processarLeadgen(): idempotência → busca no Graph → PERSISTE (decide 200×500)
//     → marca idempotência → dispara o downstream em background.
//
// Injeção de dependências (`opts.deps`) é só para os testes.

import { createHmac, timingSafeEqual } from 'node:crypto';
import * as db from '../db.js';
import * as metaLeads from '../integrations/metaLeads.js';
import { persistirLead, executarDownstream, normalizarTelefoneBR } from '../services/processarLead.js';

/**
 * Valida a assinatura `X-Hub-Signature-256` sobre o CORPO CRU (bytes), não sobre
 * o JSON reparseado. Compara em tempo constante (timingSafeEqual).
 */
export function assinaturaValida(rawBody, header, appSecret) {
  if (!appSecret || typeof header !== 'string' || rawBody == null) return false;
  const corpo = Buffer.isBuffer(rawBody) ? rawBody : Buffer.from(String(rawBody), 'utf8');
  const esperado = 'sha256=' + createHmac('sha256', appSecret).update(corpo).digest('hex');
  const a = Buffer.from(header);
  const b = Buffer.from(esperado);
  if (a.length !== b.length) return false;
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

// Tokens que contam como "sim" numa pergunta de opt-in/consentimento.
const AFIRMATIVOS = new Set(['true', '1', 'sim', 'yes', 'y', 'on', 'checked', 'aceito', 'concordo', 'autorizo']);

/**
 * Detecta o opt-in de WhatsApp no field_data. Sem um campo de opt-in confirmado
 * (ou sem valor afirmativo) → false (LGPD-safe: não dispara M0 ativa sem opt-in).
 */
function detectarOptin(fieldData, optinKey) {
  const candidatos = [optinKey, 'optin', 'opt_in', 'consentimento', 'consent', 'whatsapp', 'autorizo', 'concordo', 'aceito'].filter(Boolean);
  const v = pegarValor(fieldData, ...candidatos);
  if (v == null) return false;
  return AFIRMATIVOS.has(String(v).trim().toLowerCase());
}

/**
 * Mapeia a resposta do Graph (de um leadgen) para o nosso formato de lead.
 * @param {object} graphData
 * @param {{objetivoKey?:string, optinKey?:string}} [opts]
 * @returns {{nome, telefone, email, intencao, whatsappOptin, consentimentoEm, adId, formId}}
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
  const intencao = pegarValor(fd, objetivoKey, 'objetivo', 'intencao', 'finalidade');
  const whatsappOptin = detectarOptin(fd, opts.optinKey);

  // O envio do Instant Form (que exige link de política) é o aceite LGPD.
  const consentimentoEm = graphData?.created_time
    ? new Date(graphData.created_time).toISOString()
    : null;

  return {
    nome,
    telefone,
    email,
    intencao,
    whatsappOptin,
    consentimentoEm,
    adId: graphData?.ad_id || null,
    formId: graphData?.form_id || null,
  };
}

/**
 * Processa UM `value` de leadgen do webhook.
 *
 * LANÇA quando o Graph não responde ou a PERSISTÊNCIA inicial falha — assim o
 * server devolve 500 e o Meta reenvia. `{duplicate:true}` se já visto. O downstream
 * (Praedium/Brevo/M0/corretor) roda em BACKGROUND e nunca lança; é exposto em
 * `.downstream` para os testes aguardarem.
 *
 * @param {{leadgen_id:string, ad_id?:string, form_id?:string}} value
 * @param {{deps?:object, log?:object}} [opts]
 */
export async function processarLeadgen(value, opts = {}) {
  const { deps = {}, log = console } = opts;
  const _db = deps.db || db;
  const _metaLeads = deps.metaLeads || metaLeads;
  const _persistirLead = deps.persistirLead || persistirLead;
  const _executarDownstream = deps.executarDownstream || executarDownstream;

  const leadgenId = value?.leadgen_id;
  if (!leadgenId) {
    log.warn?.('[meta-lead] change sem leadgen_id — ignorando.');
    return { ignorado: true };
  }

  // 1) Idempotência.
  if (await _db.leadgenJaProcessado(leadgenId)) {
    log.info?.(`[meta-lead] leadgen ${leadgenId} já processado — ignorando reentrega.`);
    return { duplicate: true };
  }

  // 2) Busca no Graph. Falha (token/transiente) → lança (→500).
  const resp = await _metaLeads.buscarLead(leadgenId);
  if (!resp?.ok) {
    throw new Error(`graph_fetch_falhou: ${resp?.erro || resp?.status || 'desconhecido'}`);
  }

  // 3) Mapeia o formulário.
  const objetivoKey = process.env.META_LEAD_FIELD_OBJETIVO || 'objetivo';
  const optinKey = process.env.META_LEAD_FIELD_OPTIN || '';
  const m = mapearFieldData(resp.data, { objetivoKey, optinKey });
  if (!m.telefone) {
    log.warn?.(`[meta-lead] leadgen ${leadgenId} sem telefone — seguindo com os dados disponíveis.`);
  }

  const meta = {
    leadgenId,
    adId: value?.ad_id || m.adId || null,
    formId: value?.form_id || m.formId || null,
  };
  const lead = {
    nome: m.nome,
    telefone: m.telefone,
    email: m.email,
    intencao: m.intencao,
    origem: 'meta_lead_ads',
    fonte: 'meta_form',
    consentimento_em: m.consentimentoEm,
    whatsapp_optin: m.whatsappOptin,
    mensagemCrm:
      `Lead via Meta Lead Ads (formulário ${meta.formId || '-'}). ` +
      `Objetivo: ${m.intencao || '-'}. Opt-in WhatsApp: ${m.whatsappOptin ? 'sim' : 'não'}. ad_id: ${meta.adId || '-'}.`,
    brevoListId: process.env.BREVO_LIST_ID_VIP,
    meta,
  };

  // 4) PERSISTE (decide 200×500). Falha → lança → 500 → Meta reenvia (não marcamos).
  const p = await _persistirLead(lead, { deps, log });
  if (!p.persistido) {
    throw new Error(`persistencia_falhou: leadgen ${leadgenId}`);
  }

  // 5) Persistiu → marca idempotência.
  await _db.marcarLeadgenProcessado(leadgenId);

  // 6) Downstream em BACKGROUND (responde 200 rápido). Nunca lança.
  const downstream = Promise.resolve(_executarDownstream(lead, p.row, { deps, log })).catch((err) =>
    log.error?.(`[meta-lead] erro no downstream do leadgen ${leadgenId}: ${err?.message || err}`),
  );

  log.info?.(`[meta-lead] leadgen ${leadgenId} persistido (fonte=meta_form); downstream em background.`);
  return { ok: true, telefone: p.telefone, downstream };
}
