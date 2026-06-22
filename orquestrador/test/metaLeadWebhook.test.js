// test/metaLeadWebhook.test.js — webhook do Meta Lead Ads: assinatura, mapeamento
// (incl. opt-in), idempotência e o roteamento persistir→200 / downstream.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';

import {
  assinaturaValida,
  mapearFieldData,
  processarLeadgen,
} from '../src/handlers/metaLeadWebhook.js';
import { normalizarTelefoneBR, soDigitos } from '../src/services/processarLead.js';
import { criarDbFake, criarIntegracoesFake, ehM0Ativa, ehNotificacaoCorretor } from './_fakes.js';

process.env.CORRETOR_WHATSAPP = '5565992326461';
delete process.env.M0_ATIVA_ENABLED;
const silencioso = { info() {}, warn() {}, error() {} };

// ------------------------------------------------------------------ //
// 1) Assinatura X-Hub-Signature-256 sobre o corpo CRU                 //
// ------------------------------------------------------------------ //

test('assinatura válida sobre o corpo cru (Buffer)', () => {
  const secret = 'app-secret-xyz';
  const raw = Buffer.from(JSON.stringify({ object: 'page', entry: [] }), 'utf8');
  const header = 'sha256=' + createHmac('sha256', secret).update(raw).digest('hex');
  assert.equal(assinaturaValida(raw, header, secret), true);
});

test('assinatura inválida → false (header errado, ausente, sem secret, sem corpo)', () => {
  const raw = Buffer.from('{"object":"page"}', 'utf8');
  assert.equal(assinaturaValida(raw, 'sha256=deadbeef', 'app-secret-xyz'), false);
  assert.equal(assinaturaValida(raw, undefined, 'app-secret-xyz'), false);
  assert.equal(assinaturaValida(raw, 'sha256=abc', ''), false);
  assert.equal(assinaturaValida(null, 'sha256=abc', 's'), false);
});

test('assinatura falha se o corpo foi adulterado após assinar', () => {
  const secret = 's3cr3t';
  const raw = Buffer.from('{"a":1}', 'utf8');
  const header = 'sha256=' + createHmac('sha256', secret).update(raw).digest('hex');
  assert.equal(assinaturaValida(Buffer.from('{"a":2}', 'utf8'), header, secret), false);
});

// ------------------------------------------------------------------ //
// 2) Normalização de telefone                                         //
// ------------------------------------------------------------------ //

test('normalizarTelefoneBR: prefixa 55 em número nacional e preserva DDI', () => {
  assert.equal(normalizarTelefoneBR('+55 65 99999-1234'), '5565999991234');
  assert.equal(normalizarTelefoneBR('(65) 98888-0000'), '5565988880000');
  assert.equal(normalizarTelefoneBR('6532230000'), '556532230000');
  assert.equal(soDigitos('(65) 9 9999-0000'), '65999990000');
});

// ------------------------------------------------------------------ //
// 3) Mapeamento do field_data (incl. opt-in)                          //
// ------------------------------------------------------------------ //

test('mapeia full_name / phone / email / objetivo / opt-in + atribuição', () => {
  const data = {
    id: 'L1', created_time: '2026-06-22T10:00:00+0000', ad_id: 'AD123', form_id: 'FORM9',
    field_data: [
      { name: 'full_name', values: ['João da Silva'] },
      { name: 'phone_number', values: ['+55 65 99999-1234'] },
      { name: 'email', values: ['joao@exemplo.com'] },
      { name: 'objetivo', values: ['Investir'] },
      { name: 'optin', values: ['true'] },
    ],
  };
  const m = mapearFieldData(data, { objetivoKey: 'objetivo', optinKey: 'optin' });
  assert.equal(m.nome, 'João da Silva');
  assert.equal(m.telefone, '5565999991234');
  assert.equal(m.email, 'joao@exemplo.com');
  assert.equal(m.intencao, 'Investir');
  assert.equal(m.whatsappOptin, true);
  assert.equal(m.adId, 'AD123');
  assert.equal(m.formId, 'FORM9');
  assert.ok(m.consentimentoEm);
});

test('mapeia first_name + last_name; opt-in ausente → false (LGPD-safe)', () => {
  const data = { field_data: [
    { name: 'first_name', values: ['Maria'] },
    { name: 'last_name', values: ['Souza'] },
    { name: 'phone_number', values: ['65 98888-0000'] },
  ] };
  const m = mapearFieldData(data, { objetivoKey: 'objetivo' });
  assert.equal(m.nome, 'Maria Souza');
  assert.equal(m.telefone, '5565988880000');
  assert.equal(m.whatsappOptin, false);
});

test('objetivo via key custom + opt-in por fallback (consentimento=sim)', () => {
  const data = { field_data: [
    { name: 'qual_o_seu_objetivo', values: ['Morar'] },
    { name: 'consentimento', values: ['sim'] },
  ] };
  const m = mapearFieldData(data, { objetivoKey: 'qual_o_seu_objetivo' });
  assert.equal(m.intencao, 'Morar');
  assert.equal(m.whatsappOptin, true);
});

test('opt-in com valor negativo → false', () => {
  const data = { field_data: [{ name: 'optin', values: ['nao'] }] };
  assert.equal(mapearFieldData(data, { optinKey: 'optin' }).whatsappOptin, false);
});

// ------------------------------------------------------------------ //
// 4) processarLeadgen: idempotência, persist→200, falhas→500           //
// ------------------------------------------------------------------ //

function montarDeps({ db, integr, graph }) {
  return {
    db,
    metaLeads: { buscarLead: async () => graph },
    praedium: integr.praedium,
    brevo: integr.brevo,
    zapi: integr.zapi,
  };
}

const graphComOptin = {
  ok: true,
  data: {
    id: 'L1', created_time: '2026-06-22T10:00:00+0000', ad_id: 'A', form_id: 'F',
    field_data: [
      { name: 'full_name', values: ['Lead Teste'] },
      { name: 'phone_number', values: ['+5565999990000'] },
      { name: 'email', values: ['lead@x.com'] },
      { name: 'objetivo', values: ['Investir'] },
      { name: 'optin', values: ['true'] },
    ],
  },
};

test('idempotência: mesmo leadgen_id processa 1x (createLead único)', async () => {
  const db = criarDbFake();
  const integr = criarIntegracoesFake();
  const deps = montarDeps({ db, integr, graph: graphComOptin });
  const value = { leadgen_id: 'L1', ad_id: 'A', form_id: 'F' };

  const r1 = await processarLeadgen(value, { deps, log: silencioso });
  await r1.downstream;
  const r2 = await processarLeadgen(value, { deps, log: silencioso });

  assert.equal(r1.ok, true);
  assert.equal(r2.duplicate, true);
  assert.equal(db._leads.size, 1);
});

test('lead Meta com opt-in: fonte=meta_form + M0 ativa + corretor', async () => {
  const db = criarDbFake();
  const integr = criarIntegracoesFake();
  const deps = montarDeps({ db, integr, graph: graphComOptin });

  const r = await processarLeadgen({ leadgen_id: 'L1', ad_id: 'A', form_id: 'F' }, { deps, log: silencioso });
  await r.downstream;

  const lead = await db.getLeadByPhone('5565999990000');
  assert.equal(lead.fonte, 'meta_form');
  assert.equal(lead.whatsapp_optin, true);
  assert.equal(integr.calls.praedium.length, 1);
  assert.equal(integr.calls.brevoAdd.length, 1);
  assert.equal(integr.calls.zapi.filter(ehM0Ativa).length, 1, 'M0 ativa enviada 1x');
  assert.equal(integr.calls.zapi.filter(ehNotificacaoCorretor).length, 1, 'corretor notificado 1x');
  const ev = db._eventos.find((e) => e.tipo === 'lead_meta_form');
  assert.ok(ev, 'evento de atribuição registrado');
});

test('lead Meta SEM opt-in: NÃO envia M0 ativa, mas notifica corretor', async () => {
  const graphSemOptin = JSON.parse(JSON.stringify(graphComOptin));
  graphSemOptin.data.field_data = graphSemOptin.data.field_data.filter((f) => f.name !== 'optin');
  const db = criarDbFake();
  const integr = criarIntegracoesFake();
  const deps = montarDeps({ db, integr, graph: graphSemOptin });

  const r = await processarLeadgen({ leadgen_id: 'L2' }, { deps, log: silencioso });
  await r.downstream;

  assert.equal(integr.calls.zapi.filter(ehM0Ativa).length, 0, 'sem opt-in → sem M0 ativa');
  assert.equal(integr.calls.zapi.filter(ehNotificacaoCorretor).length, 1, 'corretor sempre notificado');
});

test('persistência falha → lança (→500) e NÃO marca idempotência', async () => {
  const db = criarDbFake();
  db.createLead = async () => { throw new Error('db down'); };
  const integr = criarIntegracoesFake();
  const deps = montarDeps({ db, integr, graph: graphComOptin });

  await assert.rejects(() => processarLeadgen({ leadgen_id: 'L9' }, { deps, log: silencioso }), /persistencia_falhou/);
  assert.equal(await db.leadgenJaProcessado('L9'), false);
});

test('Graph não responde → lança (→500)', async () => {
  const db = criarDbFake();
  const integr = criarIntegracoesFake();
  const deps = montarDeps({ db, integr, graph: { ok: false, erro: 'token_expirado', status: 400 } });
  await assert.rejects(() => processarLeadgen({ leadgen_id: 'L1' }, { deps, log: silencioso }), /graph_fetch_falhou/);
});
