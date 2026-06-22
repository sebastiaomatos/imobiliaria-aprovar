// services/processarLead.js — processamento ÚNICO de lead para qualquer canal de
// captação (landing /cadastro, Meta Lead Ads, …).
//
// Centraliza o que antes vivia dentro do POST /cadastro: persiste o lead no banco
// (idempotente por telefone), cria no CRM Praedium e adiciona à lista VIP do Brevo
// (quando há e-mail válido). NÃO lança em falha de downstream nem de persistência —
// devolve um resultado estruturado (`persistido`, `praedium`, `brevo`) e quem chama
// decide o que fazer (o /cadastro ignora a falha e responde 200; o webhook do Meta
// usa `persistido === false` para devolver 500 e o Meta reenviar).
//
// Injeção de dependências (`opts.deps`) é só para os testes; em produção usa os
// módulos reais por padrão.

import * as db from '../db.js';
import * as praedium from '../integrations/praedium.js';
import * as brevo from '../integrations/brevo.js';

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/** Só dígitos (mesma normalização que o /cadastro sempre usou no telefone). */
export function soDigitos(valor) {
  return String(valor || '').replace(/\D/g, '');
}

/**
 * Normaliza um telefone brasileiro para o formato do projeto: 55 + DDD + número.
 * Usado pelos canais que recebem o número em formato livre (ex.: Meta Lead Ads,
 * que entrega "+55 65 99999-1234"). O /cadastro NÃO usa isto (preserva o
 * comportamento histórico de apenas remover não-dígitos).
 * @param {string} input
 * @returns {string}
 */
export function normalizarTelefoneBR(input) {
  const d = soDigitos(input);
  if (d.startsWith('55') && (d.length === 12 || d.length === 13)) return d; // já tem DDI
  if (d.length === 10 || d.length === 11) return '55' + d;                  // nacional → prefixa DDI
  return d; // fora do padrão conhecido: devolve como veio (defensivo)
}

/**
 * Processa um lead pelo fluxo padrão (persistência + CRM + Brevo).
 *
 * @param {object} lead
 * @param {string}  lead.nome
 * @param {string}  lead.telefone            bruto ou normalizado (aqui só removemos não-dígitos)
 * @param {string} [lead.email]
 * @param {string} [lead.intencao]           ex.: morar/investir/construir (campo "objetivo")
 * @param {string}  lead.origem              rótulo de origem (createLead + Praedium)
 * @param {string}  lead.fonte               ex.: 'landing:botanique-residence:VIP' | 'meta_form'
 * @param {string} [lead.consentimentoEm]    ISO (LGPD) ou null
 * @param {string} [lead.mensagemCrm]        texto enviado ao Praedium
 * @param {string|number} [lead.brevoListId] lista do Brevo (default BREVO_LIST_ID_VIP)
 * @param {object} [lead.meta]               {leadgenId, adId, formId} — só auditoria/atribuição
 * @param {object} [opts]
 * @param {object} [opts.deps]               injeção p/ testes ({db, praedium, brevo})
 * @param {object} [opts.log]
 * @returns {Promise<{ok:boolean, persistido:boolean, telefone:string, emailValido:boolean,
 *                     praedium:object, brevo:object}>}
 */
export async function processarLead(lead, opts = {}) {
  const { deps = {}, log = console } = opts;
  const _db = deps.db || db;
  const _praedium = deps.praedium || praedium;
  const _brevo = deps.brevo || brevo;

  const {
    nome = null,
    telefone,
    email,
    intencao = null,
    origem = null,
    fonte = null,
    consentimentoEm = null,
    mensagemCrm = null,
    brevoListId = process.env.BREVO_LIST_ID_VIP,
    meta = null,
  } = lead || {};

  const tel = soDigitos(telefone);
  const emailRaw = typeof email === 'string' ? email.trim() : '';
  const emailValido = EMAIL_RE.test(emailRaw);

  // (1) Persiste no nosso banco (idempotente por telefone). NÃO derruba o fluxo se
  //     falhar — mas reporta via `persistido` para quem precisa garantir gravação.
  let persistido = false;
  try {
    await _db.createLead({
      phone: tel,
      nome,
      origem,
      intencao,
      estagio: 'novo',
      fonte,
      consentimentoEm,
    });
    persistido = true;
  } catch (err) {
    log.warn?.(`[processarLead] não consegui persistir o lead no banco: ${err?.message || err}`);
  }

  // (1.1) Auditoria de atribuição (só quando vem metadado de anúncio, ex.: Meta).
  //       Mantém o /cadastro IDÊNTICO (ele não passa `meta` → não grava evento).
  if (meta && persistido) {
    try {
      await _db.registrarEvento(tel, 'lead_meta_form', { meta, intencao, fonte });
    } catch (err) {
      log.warn?.(`[processarLead] falha ao registrar evento de atribuição: ${err?.message || err}`);
    }
  }

  // (2) Cria o lead no CRM Praedium (defensivo: pula se não configurado).
  const praedRes = await _praedium.enviarLead({
    nome,
    phone: tel,
    email: emailValido ? emailRaw : null,
    origem,
    mensagem: mensagemCrm,
  });

  // (3) Adiciona à lista VIP do Brevo, se houver e-mail válido.
  let brevoRes = { ok: true, pulado: true, motivo: 'sem_email' };
  if (emailValido) {
    brevoRes = await _brevo.adicionarContato(emailRaw, nome, brevoListId);
  }

  return { ok: true, persistido, telefone: tel, emailValido, praedium: praedRes, brevo: brevoRes };
}
