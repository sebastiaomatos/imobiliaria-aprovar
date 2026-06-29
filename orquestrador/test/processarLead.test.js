// test/processarLead.test.js — serviço único: regressão do /cadastro (persist +
// Praedium + Brevo), M0 ativa proativa (gating + idempotência) e notificação ao
// corretor.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { processarLead } from '../src/services/processarLead.js';
import { criarDbFake, criarIntegracoesFake, ehM0Ativa, ehM0Materiais, ehNotificacaoCorretor } from './_fakes.js';

process.env.CORRETOR_WHATSAPP = '5565992326461';
delete process.env.M0_ATIVA_ENABLED; // default = 'true'
const silencioso = { info() {}, warn() {}, error() {} };

function ambiente(seed = []) {
  const db = criarDbFake(seed);
  const integr = criarIntegracoesFake();
  const deps = { db, praedium: integr.praedium, brevo: integr.brevo, zapi: integr.zapi };
  return { db, integr, deps };
}

const leadSite = (over = {}) => ({
  nome: 'Ana',
  telefone: '(65) 99999-0000',
  email: 'ana@x.com',
  intencao: 'morar',
  origem: 'landing:botanique-residence',
  fonte: 'landing:botanique-residence:VIP',
  consentimentoEm: '2026-06-22T00:00:00.000Z',
  whatsapp_optin: true,
  mensagemCrm: 'Cadastro VIP via landing',
  brevoListId: 7,
  ...over,
});

// ----------------------- Regressão do /cadastro ----------------------- //

test('/cadastro: e-mail válido → persist (email+optin) + Praedium + Brevo; shape', async () => {
  const { db, integr, deps } = ambiente();
  const r = await processarLead(leadSite(), { deps, log: silencioso });

  assert.equal(r.ok, true);
  assert.equal(r.persistido, true);
  assert.equal(r.emailValido, 'ana@x.com');
  assert.equal(r.praedium.ok, true);
  assert.equal(r.brevo.ok, true);

  const lead = await db.getLeadByPhone('65999990000');
  assert.equal(lead.fonte, 'landing:botanique-residence:VIP');
  assert.equal(lead.email, 'ana@x.com');
  assert.equal(lead.whatsapp_optin, true);
  assert.equal(integr.calls.praedium[0].phone, '65999990000');
  assert.equal(integr.calls.brevoAdd[0].listId, 7);
});

test('/cadastro: sem e-mail → Brevo pulado; Praedium recebe email null', async () => {
  const { integr, deps } = ambiente();
  const r = await processarLead(leadSite({ email: undefined }), { deps, log: silencioso });
  assert.equal(integr.calls.brevoAdd.length, 0);
  assert.equal(r.brevo.pulado, true);
  assert.equal(integr.calls.praedium[0].email, null);
});

test('/cadastro: e-mail inválido não vaza para Brevo nem Praedium', async () => {
  const { integr, deps } = ambiente();
  const r = await processarLead(leadSite({ email: 'nao-eh-email' }), { deps, log: silencioso });
  assert.equal(integr.calls.brevoAdd.length, 0);
  assert.equal(r.emailValido, null);
  assert.equal(integr.calls.praedium[0].email, null);
});

test('processarLead NÃO lança quando o banco cai (persistido=false; segue downstream)', async () => {
  const { integr, deps } = ambiente();
  deps.db.createLead = async () => { throw new Error('db down'); };
  const r = await processarLead(leadSite(), { deps, log: silencioso });
  assert.equal(r.ok, true);
  assert.equal(r.persistido, false);
  assert.equal(integr.calls.praedium.length, 1, 'mantém o histórico: segue p/ CRM mesmo sem persistir');
});

// ----------------------- M0 ativa: gating ----------------------- //

test('M0 ativa: opt-in=true → envia M0 (1x) e notifica corretor (1x)', async () => {
  const { integr, deps } = ambiente();
  await processarLead(leadSite(), { deps, log: silencioso });
  assert.equal(integr.calls.zapi.filter(ehM0Ativa).length, 1);
  assert.equal(integr.calls.zapi.filter(ehNotificacaoCorretor).length, 1);
});

test('M0 ativa: opt-in=false → NÃO envia M0, mas notifica corretor', async () => {
  const { integr, deps } = ambiente();
  await processarLead(leadSite({ whatsapp_optin: false }), { deps, log: silencioso });
  assert.equal(integr.calls.zapi.filter(ehM0Ativa).length, 0);
  assert.equal(integr.calls.zapi.filter(ehNotificacaoCorretor).length, 1);
});

test("M0 ativa: M0_ATIVA_ENABLED='false' → NÃO envia M0, mas notifica corretor", async () => {
  process.env.M0_ATIVA_ENABLED = 'false';
  try {
    const { integr, deps } = ambiente();
    await processarLead(leadSite(), { deps, log: silencioso });
    assert.equal(integr.calls.zapi.filter(ehM0Ativa).length, 0);
    assert.equal(integr.calls.zapi.filter(ehNotificacaoCorretor).length, 1);
  } finally {
    delete process.env.M0_ATIVA_ENABLED;
  }
});

test('M0 ativa: idempotência — 2ª chamada não reenvia M0 nem renotifica corretor', async () => {
  const { integr, deps } = ambiente();
  await processarLead(leadSite(), { deps, log: silencioso });
  await processarLead(leadSite(), { deps, log: silencioso });
  assert.equal(integr.calls.zapi.filter(ehM0Ativa).length, 1);
  assert.equal(integr.calls.zapi.filter(ehNotificacaoCorretor).length, 1);
});

test('M0 ativa: lead já em_atendimento (inbound) → não duplica M0', async () => {
  const { integr, deps } = ambiente([{ phone: '65999990000', estagio: 'em_atendimento', whatsapp_optin: true }]);
  await processarLead(leadSite(), { deps, log: silencioso });
  assert.equal(integr.calls.zapi.filter(ehM0Ativa).length, 0);
});

test('M0 ativa: lead com opt-out → não envia M0', async () => {
  const { integr, deps } = ambiente([{ phone: '65999990000', whatsapp_optout_em: '2026-06-20T00:00:00.000Z', optout: true, whatsapp_optin: true }]);
  await processarLead(leadSite(), { deps, log: silencioso });
  assert.equal(integr.calls.zapi.filter(ehM0Ativa).length, 0);
});

// ----------------------- Fluxo "materiais" (LP nova) ----------------------- //

test("fluxo materiais: fonte 'lp-botanique-nova' → M0 de materiais + lista VIP_B + telefone p/ Brevo", async () => {
  process.env.BREVO_LIST_ID_VIP_B = '99';
  process.env.BOTANIQUE_MAPA_URL = 'https://aprovar/mapa.pdf';
  process.env.BOTANIQUE_TABELA_URL = 'https://aprovar/tabela.pdf';
  try {
    const { db, integr, deps } = ambiente();
    await processarLead(leadSite({ fonte: 'lp-botanique-nova', brevoListId: undefined }), { deps, log: silencioso });

    const m0 = integr.calls.zapi.filter(ehM0Ativa);
    assert.equal(m0.length, 1, 'M0 ativa enviada 1x');
    assert.ok(ehM0Materiais(m0[0]), 'usa a variante de materiais');
    assert.match(m0[0].message, /https:\/\/aprovar\/mapa\.pdf/, 'mapa preenchido');
    assert.match(m0[0].message, /https:\/\/aprovar\/tabela\.pdf/, 'tabela preenchida');

    assert.equal(integr.calls.brevoAdd[0].listId, '99', 'lista Brevo VIP_B');
    assert.equal(integr.calls.brevoAdd[0].telefone, '65999990000', 'telefone passado ao Brevo');

    // As mensagens seguintes (R1..R5b) permanecem idênticas.
    assert.deepEqual(db._agendamentos.map((a) => a.etapa), ['R1', 'R2', 'R3', 'R4', 'R5a', 'R5b']);
  } finally {
    delete process.env.BREVO_LIST_ID_VIP_B;
    delete process.env.BOTANIQUE_MAPA_URL;
    delete process.env.BOTANIQUE_TABELA_URL;
  }
});

test('fluxo materiais: fonte comum → mantém M0_ATIVA original + lista VIP (fluxo inalterado)', async () => {
  process.env.BREVO_LIST_ID_VIP = '7';
  try {
    const { integr, deps } = ambiente();
    await processarLead(leadSite({ brevoListId: undefined }), { deps, log: silencioso }); // fonte VIP padrão
    const m0 = integr.calls.zapi.filter(ehM0Ativa);
    assert.equal(m0.length, 1);
    assert.equal(ehM0Materiais(m0[0]), false, 'NÃO usa a variante de materiais');
    assert.match(m0[0].message, /Que bom te ter na lista VIP/i, 'usa a M0_ATIVA original');
    assert.equal(integr.calls.brevoAdd[0].listId, '7', 'lista VIP original (não VIP_B)');
  } finally {
    delete process.env.BREVO_LIST_ID_VIP;
  }
});

// ----------------------- Régua R1..R5b (LP/Meta) ----------------------- //

test('régua: opt-in=true → agenda R1..R5b (continuação da M0 ativa)', async () => {
  const { db, integr, deps } = ambiente();
  await processarLead(leadSite(), { deps, log: silencioso });
  assert.equal(integr.calls.zapi.filter(ehM0Ativa).length, 1, 'M0 ativa enviada');
  assert.deepEqual(
    db._agendamentos.map((a) => a.etapa),
    ['R1', 'R2', 'R3', 'R4', 'R5a', 'R5b'],
    'régua R1..R5b agendada',
  );
});

test('régua: opt-in=false → NÃO agenda régua (sem trilho proativo)', async () => {
  const { db, deps } = ambiente();
  await processarLead(leadSite({ whatsapp_optin: false }), { deps, log: silencioso });
  assert.equal(db._agendamentos.length, 0, 'sem opt-in não agenda régua');
});

test('régua: M0_ATIVA_ENABLED=false → NÃO agenda régua (trilho proativo desligado)', async () => {
  process.env.M0_ATIVA_ENABLED = 'false';
  try {
    const { db, deps } = ambiente();
    await processarLead(leadSite(), { deps, log: silencioso });
    assert.equal(db._agendamentos.length, 0, 'régua segue a M0 ativa: desligada → sem régua');
  } finally {
    delete process.env.M0_ATIVA_ENABLED;
  }
});

test('régua: idempotência — 2ª chamada não reagenda R1..R5b', async () => {
  const { db, deps } = ambiente();
  await processarLead(leadSite(), { deps, log: silencioso });
  await processarLead(leadSite(), { deps, log: silencioso });
  assert.equal(db._agendamentos.filter((a) => a.etapa === 'R1').length, 1, 'R1 agendada uma única vez');
});
