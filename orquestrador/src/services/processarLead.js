// services/processarLead.js — processamento ÚNICO de lead para qualquer canal de
// captação (landing /cadastro, Meta Lead Ads, …).
//
// Pipeline (na ordem da spec):
//   (a) normalizar telefone → (b) PERSISTIR (incl. whatsapp_optin, consentimento_em,
//   fonte, m0_ativa_enviada=false) → (c) Praedium → (d) Brevo → (e) M0 ativa (opt-in)
//   → (f) notificar o corretor → (g) régua R1..R5b (continuação da M0 ativa, opt-in).
//
// É exposto em três níveis para permitir respostas rápidas (webhook responde após
// PERSISTIR e segue o downstream em background):
//   - persistirLead()      : normaliza + grava (await curto, decide 200×500).
//   - executarDownstream() : Praedium + Brevo + M0 ativa + corretor (nunca lança).
//   - processarLead()      : persistir + downstream, tudo aguardado (/cadastro, testes).
//
// Injeção de dependências (`opts.deps`) é só para os testes; em produção usa os
// módulos reais por padrão.

import * as db from '../db.js';
import * as praedium from '../integrations/praedium.js';
import * as brevo from '../integrations/brevo.js';
import * as zapi from '../integrations/zapi.js';
import { MENSAGENS, preencher, aplicar, montarAgenda, AGENDA_RECUPERACAO } from '../regua.js';

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// Fontes cujo PRIMEIRO contato entrega os materiais (mapa + tabela) por WhatsApp/
// e-mail — variante M0_ATIVA_MATERIAIS + lista Brevo própria. Demais fontes seguem
// inalteradas (M0_ATIVA + lista VIP original). Set p/ permitir futuras LPs sem if-else.
const FONTES_FLUXO_MATERIAIS = new Set(['lp-botanique-nova']);
function ehFluxoMateriais(lead) { return FONTES_FLUXO_MATERIAIS.has(lead?.fonte); }

/** Só dígitos (mesma normalização que o /cadastro sempre usou no telefone). */
export function soDigitos(valor) {
  return String(valor || '').replace(/\D/g, '');
}

/**
 * Normaliza um telefone brasileiro para 55 + DDD + número. Usado pelos canais que
 * recebem o número em formato livre (ex.: Meta Lead Ads). O /cadastro NÃO usa isto
 * (preserva o histórico de apenas remover não-dígitos).
 */
export function normalizarTelefoneBR(input) {
  const d = soDigitos(input);
  if (d.startsWith('55') && (d.length === 12 || d.length === 13)) return d; // já tem DDI
  if (d.length === 10 || d.length === 11) return '55' + d;                  // nacional → prefixa DDI
  return d;
}

function emailValidoDe(email) {
  const e = typeof email === 'string' ? email.trim() : '';
  return EMAIL_RE.test(e) ? e : null;
}

// --------------------------------------------------------------------------- //
// (a)+(b) PERSISTÊNCIA                                                          //
// --------------------------------------------------------------------------- //

/**
 * Normaliza e PERSISTE o lead (idempotente por telefone). NÃO lança: reporta via
 * `persistido` (o webhook do Meta usa isso para devolver 500 e o Meta reenviar).
 * @returns {Promise<{persistido:boolean, row:object|null, telefone:string, emailValido:string|null}>}
 */
export async function persistirLead(lead, opts = {}) {
  const { deps = {}, log = console } = opts;
  const _db = deps.db || db;

  const tel = soDigitos(lead?.telefone);
  const emailValido = emailValidoDe(lead?.email);

  let row = null;
  let persistido = false;
  try {
    row = await _db.createLead({
      phone: tel,
      nome: lead?.nome ?? null,
      origem: lead?.origem ?? null,
      intencao: lead?.intencao ?? null,
      estagio: 'novo',
      fonte: lead?.fonte ?? null,
      consentimentoEm: lead?.consentimento_em ?? lead?.consentimentoEm ?? null,
      email: emailValido,
      whatsappOptin: lead?.whatsapp_optin === true,
    });
    persistido = true;
  } catch (err) {
    log.warn?.(`[processarLead] não consegui persistir o lead no banco: ${err?.message || err}`);
  }

  // Auditoria de atribuição (só quando vem metadado de anúncio, ex.: Meta).
  if (lead?.meta && persistido) {
    try {
      await _db.registrarEvento(tel, 'lead_meta_form', { meta: lead.meta, intencao: lead?.intencao, fonte: lead?.fonte });
    } catch (err) {
      log.warn?.(`[processarLead] falha ao registrar evento de atribuição: ${err?.message || err}`);
    }
  }

  return { persistido, row, telefone: tel, emailValido };
}

// --------------------------------------------------------------------------- //
// (c)+(d) CRM + LISTAS                                                          //
// --------------------------------------------------------------------------- //

async function enviarCrmEListas(lead, telefone, emailValido, opts = {}) {
  const { deps = {}, log = console } = opts;
  const _praedium = deps.praedium || praedium;
  const _brevo = deps.brevo || brevo;

  let praedRes;
  try {
    praedRes = await _praedium.enviarLead({
      nome: lead?.nome ?? null,
      phone: telefone,
      email: emailValido,
      origem: lead?.origem ?? null,
      mensagem: lead?.mensagemCrm ?? null,
    });
  } catch (err) {
    log.warn?.(`[processarLead] Praedium falhou: ${err?.message || err}`);
    praedRes = { ok: false, erro: err?.message || String(err) };
  }

  let brevoRes = { ok: true, pulado: true, motivo: 'sem_email' };
  if (emailValido) {
    try {
      const listId = lead?.brevoListId ?? (ehFluxoMateriais(lead) ? process.env.BREVO_LIST_ID_VIP_B : process.env.BREVO_LIST_ID_VIP);
      brevoRes = await _brevo.adicionarContato(emailValido, lead?.nome ?? null, listId, telefone);
    } catch (err) {
      log.warn?.(`[processarLead] Brevo falhou: ${err?.message || err}`);
      brevoRes = { ok: false, erro: err?.message || String(err) };
    }
  }

  return { praedium: praedRes, brevo: brevoRes };
}

// --------------------------------------------------------------------------- //
// (e) M0 ATIVA (proativa, só com opt-in) — coordena com a régua inbound         //
// --------------------------------------------------------------------------- //

async function enviarM0Ativa(lead, row, telefone, opts = {}) {
  const { deps = {}, log = console } = opts;
  const _db = deps.db || db;
  const _zapi = deps.zapi || zapi;

  const habilitada = (process.env.M0_ATIVA_ENABLED ?? 'true') !== 'false';
  if (!habilitada) return { enviada: false, motivo: 'desabilitada' };
  if (lead?.whatsapp_optin !== true) return { enviada: false, motivo: 'sem_optin' };
  if (row?.whatsapp_optout_em || row?.optout) return { enviada: false, motivo: 'optout' };
  if (row?.m0_ativa_enviada) return { enviada: false, motivo: 'ja_enviada' };
  // Coordenação com a régua inbound: lead já conversando com humano → não duplica.
  if (row?.estagio === 'em_atendimento') {
    try { await _db.updateLead(telefone, { m0_ativa_enviada: true }); } catch { /* best-effort */ }
    return { enviada: false, motivo: 'em_atendimento' };
  }

  // Fonte da LP nova → entrega os materiais (mapa + tabela) já no 1º contato;
  // demais fontes mantêm a M0_ATIVA original (fluxo inalterado).
  const texto = ehFluxoMateriais(lead)
    ? aplicar(MENSAGENS.M0_ATIVA_MATERIAIS, { nome: lead?.nome, mapa: process.env.BOTANIQUE_MAPA_URL, tabela: process.env.BOTANIQUE_TABELA_URL })
    : preencher(MENSAGENS.M0_ATIVA, lead?.nome);
  const r = await _zapi.sendText(telefone, texto);
  if (r?.ok) {
    try { await _db.updateLead(telefone, { m0_ativa_enviada: true }); } catch (err) {
      log.warn?.(`[M0 ativa] enviada mas falhei ao marcar m0_ativa_enviada: ${err?.message || err}`);
    }
    try { await _db.registrarEvento(telefone, 'm0_ativa_enviada', { fonte: lead?.fonte }); } catch { /* best-effort */ }
    log.info?.(`[M0 ativa] enviada (lead ${row?.id ?? '?'}, fonte=${lead?.fonte}).`);
    return { enviada: true };
  }
  log.warn?.(`[M0 ativa] falha ao enviar (lead ${row?.id ?? '?'}): ${r?.erro || r?.status || 'desconhecido'}`);
  return { enviada: false, motivo: 'erro_envio' };
}

// --------------------------------------------------------------------------- //
// (f) NOTIFICAÇÃO AO CORRETOR (sempre, independe de opt-in)                     //
// --------------------------------------------------------------------------- //

async function notificarCorretor(lead, row, telefone, emailValido, opts = {}) {
  const { deps = {}, log = console } = opts;
  const _db = deps.db || db;
  const _zapi = deps.zapi || zapi;

  if (row?.corretor_notificado) return { notificado: false, motivo: 'ja_notificado' };
  const corretor = process.env.CORRETOR_WHATSAPP;
  if (!corretor) {
    log.warn?.('[notificarCorretor] CORRETOR_WHATSAPP não definido — não notifiquei.');
    return { notificado: false, motivo: 'sem_corretor' };
  }

  const texto = aplicar(MENSAGENS.NOTIFICACAO_CORRETOR, {
    nome: lead?.nome,
    telefone,
    email: emailValido || lead?.email,
    objetivo: lead?.intencao,
    fonte: lead?.fonte,
    optin: lead?.whatsapp_optin === true ? 'sim' : 'não',
    consentimento_em: lead?.consentimento_em ?? lead?.consentimentoEm,
  });

  const r = await _zapi.sendText(corretor, texto);
  if (r?.ok) {
    try { await _db.updateLead(telefone, { corretor_notificado: true }); } catch (err) {
      log.warn?.(`[notificarCorretor] notifiquei mas falhei ao marcar corretor_notificado: ${err?.message || err}`);
    }
    try { await _db.registrarEvento(telefone, 'corretor_notificado', { fonte: lead?.fonte }); } catch { /* best-effort */ }
    log.info?.(`[notificarCorretor] corretor avisado do lead ${row?.id ?? '?'} (fonte=${lead?.fonte}).`);
    return { notificado: true };
  }
  log.warn?.(`[notificarCorretor] falha ao avisar o corretor: ${r?.erro || r?.status || 'desconhecido'}`);
  return { notificado: false, motivo: 'erro_envio' };
}

// --------------------------------------------------------------------------- //
// (g) RÉGUA DE RECUPERAÇÃO (R1..R5b) — continuação da M0 ativa (opt-in)         //
// --------------------------------------------------------------------------- //

/**
 * Agenda a régua R1..R5b para leads de LP/Meta. Só agenda quando a M0 ativa foi
 * ENVIADA agora: assim herda o gate de opt-in (a M0 ativa só sai com whatsapp_optin,
 * sem opt-out, fora de em_atendimento e com a feature ligada) e a idempotência
 * (m0_ativa_enviada já garante "uma vez só", então não reagenda em reprocessamentos).
 * Para o inbound, quem agenda a régua é o webhook da Z-API.
 */
async function agendarReguaRecuperacao(telefone, m0, opts = {}) {
  const { deps = {}, log = console } = opts;
  const _db = deps.db || db;
  if (!m0?.enviada) return { agendada: false, motivo: m0?.motivo || 'm0_nao_enviada' };
  await _db.agendarMensagens(telefone, montarAgenda());
  try { await _db.registrarEvento(telefone, 'regua_agendada', { etapas: AGENDA_RECUPERACAO.map((a) => a.etapa) }); } catch { /* best-effort */ }
  log.info?.(`[régua] R1..R5b agendada para ${telefone} (continuação da M0 ativa).`);
  return { agendada: true };
}

/**
 * Downstream completo (Praedium → Brevo → M0 ativa → corretor → régua). NUNCA lança —
 * pode rodar em background (webhook) ou aguardado (/cadastro, testes).
 * @returns {Promise<{praedium:object, brevo:object, m0:object, corretor:object, regua:object}>}
 */
export async function executarDownstream(lead, row, opts = {}) {
  const { log = console } = opts;
  const telefone = row?.phone || soDigitos(lead?.telefone);
  const emailValido = row?.email ?? emailValidoDe(lead?.email);

  const { praedium: praedRes, brevo: brevoRes } = await enviarCrmEListas(lead, telefone, emailValido, opts);

  let m0 = { enviada: false, motivo: 'nao_avaliada' };
  try { m0 = await enviarM0Ativa(lead, row, telefone, opts); }
  catch (err) { log.error?.(`[processarLead] erro na M0 ativa: ${err?.message || err}`); m0 = { enviada: false, motivo: 'excecao' }; }

  let corretor = { notificado: false, motivo: 'nao_avaliada' };
  try { corretor = await notificarCorretor(lead, row, telefone, emailValido, opts); }
  catch (err) { log.error?.(`[processarLead] erro ao notificar corretor: ${err?.message || err}`); corretor = { notificado: false, motivo: 'excecao' }; }

  let regua = { agendada: false, motivo: 'nao_avaliada' };
  try { regua = await agendarReguaRecuperacao(telefone, m0, opts); }
  catch (err) { log.error?.(`[processarLead] erro ao agendar régua: ${err?.message || err}`); regua = { agendada: false, motivo: 'excecao' }; }

  return { praedium: praedRes, brevo: brevoRes, m0, corretor, regua };
}

// --------------------------------------------------------------------------- //
// ORQUESTRAÇÃO COMPLETA (síncrona) — usada pelo /cadastro e pelos testes        //
// --------------------------------------------------------------------------- //

/**
 * Persiste e roda todo o downstream, aguardando tudo.
 * @returns {Promise<{ok:boolean, persistido:boolean, telefone:string, emailValido:string|null,
 *                     praedium:object, brevo:object, m0:object, corretor:object, regua:object}>}
 */
export async function processarLead(lead, opts = {}) {
  const p = await persistirLead(lead, opts);
  const ds = await executarDownstream(lead, p.row, opts);
  return { ok: true, persistido: p.persistido, telefone: p.telefone, emailValido: p.emailValido, ...ds };
}
