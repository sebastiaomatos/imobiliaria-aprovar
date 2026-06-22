// test/processarLead.test.js — serviço único: regressão do /cadastro (persist +
// Praedium + Brevo), M0 ativa proativa (gating + idempotência) e notificação ao
// corretor.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { processarLead } from '../src/services/processarLead.js';
import { criarDbFake, criarIntegracoesFake, ehM0Ativa, ehNotificacaoCorretor } from './_fakes.js';

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
