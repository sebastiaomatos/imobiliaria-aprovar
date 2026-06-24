// test/zapiWebhook.test.js — /webhook/zapi: opt-out (SAIR), coordenação com a M0
// ativa, e não-regressão do fluxo inbound (lead novo + régua).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { processarWebhookZapi } from '../src/handlers/zapiWebhook.js';
import { processarLead } from '../src/services/processarLead.js';
import { criarDbFake, criarIntegracoesFake, ehM0Ativa } from './_fakes.js';

process.env.CORRETOR_WHATSAPP = '5565992326461';
delete process.env.M0_ATIVA_ENABLED;
const silencioso = { info() {}, warn() {}, error() {} };

function ambiente(seed = []) {
  const db = criarDbFake(seed);
  const integr = criarIntegracoesFake();
  const deps = { db, zapi: integr.zapi, praedium: integr.praedium, metaCapi: integr.metaCapi, brevo: integr.brevo };
  return { db, integr, deps };
}

const inbound = (phone, message, messageId) => ({
  type: 'ReceivedCallback', phone, senderName: 'Fulano', text: { message }, messageId,
});

// ----------------------- Opt-out ----------------------- //

test('opt-out (SAIR): marca optout + whatsapp_optout_em, para régua, confirma, reflete no Brevo', async () => {
  const { db, integr, deps } = ambiente([{ phone: '5565999991111', email: 'lead@x.com', nome: 'Fulano' }]);
  await db.agendarMensagens('5565999991111', [{ etapa: 'R1' }, { etapa: 'R2' }]);

  await processarWebhookZapi(inbound('5565999991111', 'SAIR', 'm1'), silencioso, deps);

  const lead = await db.getLeadByPhone('5565999991111');
  assert.equal(lead.optout, true);
  assert.ok(lead.whatsapp_optout_em, 'whatsapp_optout_em preenchido');
  assert.equal(db._agendamentos.filter((a) => a.status === 'pendente').length, 0, 'régua parada');
  assert.ok(integr.calls.zapi.some((m) => /não te chamo mais por aqui/i.test(m.message)), 'confirmação enviada');
  assert.equal(integr.calls.brevoDesinscrever.length, 1);
  assert.equal(integr.calls.brevoDesinscrever[0].email, 'lead@x.com');
});

test('opt-out aceita variações (PARAR/CANCELAR, case-insensitive)', async () => {
  for (const palavra of ['Parar', 'cancelar', 'pare']) {
    const { db, deps } = ambiente([{ phone: '5565999990000' }]);
    await processarWebhookZapi(inbound('5565999990000', palavra, 'mid-' + palavra), silencioso, deps);
    const lead = await db.getLeadByPhone('5565999990000');
    assert.ok(lead.whatsapp_optout_em, `"${palavra}" deve disparar opt-out`);
  }
});

test('opt-out bloqueia envio futuro: M0 ativa não é enviada a quem deu opt-out', async () => {
  const { db, integr, deps } = ambiente([{ phone: '5565999991111', email: 'lead@x.com' }]);
  await processarWebhookZapi(inbound('5565999991111', 'sair', 'm1'), silencioso, deps);

  // depois do opt-out, um cadastro de site do mesmo telefone não deve mandar M0:
  await processarLead(
    { nome: 'Fulano', telefone: '5565999991111', email: 'lead@x.com', whatsapp_optin: true, origem: 'landing:x', fonte: 'landing:x:VIP', brevoListId: 7 },
    { deps, log: silencioso },
  );
  assert.equal(integr.calls.zapi.filter(ehM0Ativa).length, 0, 'opt-out bloqueia a M0 ativa');
});

// ----------------------- Coordenação com a M0 ativa ----------------------- //

test('inbound de lead novo (captura LIGADA) agenda régua e marca m0_ativa_enviada (coordenação)', async () => {
  process.env.WHATSAPP_INBOUND_CAPTURE_ENABLED = 'true';
  try {
    const { db, integr, deps } = ambiente();
    await processarWebhookZapi(inbound('5565999992222', 'Oi, quero conhecer o Botanique', 'm2'), silencioso, deps);

    const lead = await db.getLeadByPhone('5565999992222');
    assert.ok(lead, 'lead criado');
    assert.equal(lead.m0_ativa_enviada, true, 'inbound marca m0_ativa_enviada p/ não duplicar');
    assert.ok(db._agendamentos.some((a) => a.phone === '5565999992222'), 'régua agendada');
    assert.equal(integr.calls.zapi.filter(ehM0Ativa).length, 0, 'inbound usa M0 inbound, não a M0 ativa');
  } finally {
    delete process.env.WHATSAPP_INBOUND_CAPTURE_ENABLED;
  }
});

test('lead que veio do inbound não recebe M0 ativa em cadastro posterior (sem duplicar)', async () => {
  process.env.WHATSAPP_INBOUND_CAPTURE_ENABLED = 'true';
  try {
    const { integr, deps } = ambiente();
    await processarWebhookZapi(inbound('5565999992222', 'quero saber das condições', 'm2'), silencioso, deps);
    const m0AntesDoSite = integr.calls.zapi.filter(ehM0Ativa).length;

    await processarLead(
      { nome: 'Fulano', telefone: '5565999992222', email: 'f@x.com', whatsapp_optin: true, origem: 'landing:x', fonte: 'landing:x:VIP', brevoListId: 7 },
      { deps, log: silencioso },
    );
    assert.equal(integr.calls.zapi.filter(ehM0Ativa).length, m0AntesDoSite, 'nenhuma M0 ativa adicional');
  } finally {
    delete process.env.WHATSAPP_INBOUND_CAPTURE_ENABLED;
  }
});

// ----------------------- Não-regressão inbound ----------------------- //

test('inbound existente (engajou): cancela régua, em_atendimento, evento CAPI', async () => {
  const { db, integr, deps } = ambiente([{ phone: '5565999993333', estagio: 'novo' }]);
  await db.agendarMensagens('5565999993333', [{ etapa: 'R1' }]);

  await processarWebhookZapi(inbound('5565999993333', 'tenho interesse', 'm3'), silencioso, deps);

  const lead = await db.getLeadByPhone('5565999993333');
  assert.equal(lead.estagio, 'em_atendimento');
  assert.equal(db._agendamentos.filter((a) => a.status === 'pendente').length, 0);
  assert.equal(integr.calls.metaCapi.length, 1, 'evento conversa_iniciada enviado');
});

test('idempotência inbound (captura LIGADA): mesmo messageId não reprocessa', async () => {
  process.env.WHATSAPP_INBOUND_CAPTURE_ENABLED = 'true';
  try {
    const { db, deps } = ambiente();
    await processarWebhookZapi(inbound('5565999994444', 'oi', 'dup-1'), silencioso, deps);
    const criadosApos1 = db._leads.size;
    await processarWebhookZapi(inbound('5565999994444', 'oi', 'dup-1'), silencioso, deps);
    assert.equal(db._leads.size, criadosApos1, 'reentrega ignorada');
  } finally {
    delete process.env.WHATSAPP_INBOUND_CAPTURE_ENABLED;
  }
});

// --------- Captura de inbound desligada (flag WHATSAPP_INBOUND_CAPTURE_ENABLED) --------- //

test('captura DESLIGADA (default): inbound de número desconhecido NÃO cria lead/Praedium/régua/M0 — só audita', async () => {
  delete process.env.WHATSAPP_INBOUND_CAPTURE_ENABLED; // default = false
  const { db, integr, deps } = ambiente();

  await processarWebhookZapi(inbound('5565999998888', 'Oi, vi o anúncio', 'mx1'), silencioso, deps);

  assert.equal(db._leads.size, 0, 'não cria lead');
  assert.equal(integr.calls.praedium.length, 0, 'não chama Praedium');
  assert.equal(db._agendamentos.length, 0, 'não agenda régua');
  assert.equal(integr.calls.zapi.length, 0, 'não envia nenhuma mensagem (nem M0)');
  assert.ok(db._eventos.some((e) => e.tipo === 'inbound_ignorado_sem_captura'), 'registra evento de auditoria');
});

test('escalada (pedir corretor) funciona mesmo com captura DESLIGADA', async () => {
  delete process.env.WHATSAPP_INBOUND_CAPTURE_ENABLED;
  const { db, integr, deps } = ambiente();

  await processarWebhookZapi(inbound('5565999997777', 'quero falar com um corretor', 'mx2'), silencioso, deps);

  const lead = await db.getLeadByPhone('5565999997777');
  assert.ok(lead, 'escalada cria o lead (handoff humano), independe da flag');
  assert.equal(lead.estagio, 'em_atendimento');
  assert.ok(integr.calls.zapi.some((m) => /avisando um corretor/i.test(m.message)), 'envia ESCALADA ao lead');
  assert.ok(integr.calls.zapi.some((m) => /ESCALADA HUMANA/i.test(m.message)), 'avisa o corretor');
  assert.ok(db._eventos.some((e) => e.tipo === 'escalada_humana'));
});

test('opt-out funciona mesmo com captura DESLIGADA (número desconhecido)', async () => {
  delete process.env.WHATSAPP_INBOUND_CAPTURE_ENABLED;
  const { db, integr, deps } = ambiente();

  await processarWebhookZapi(inbound('5565999996666', 'PARAR', 'mx3'), silencioso, deps);

  assert.equal(db._leads.size, 0, 'opt-out de número desconhecido não cria lead');
  assert.ok(integr.calls.zapi.some((m) => /não te chamo mais por aqui/i.test(m.message)), 'confirma o opt-out');
  assert.ok(db._eventos.some((e) => e.tipo === 'optout'), 'registra evento de opt-out');
});
