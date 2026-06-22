// test/metaLeadWebhook.test.js — testes do webhook do Meta Lead Ads e do serviço
// compartilhado processarLead (que é o coração do /cadastro após o refactor).
//
// Sem banco e sem rede: as dependências (db, integrations) são injetadas. Rode com:
//   npm test   (=> node --test test/)

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';

import {
  assinaturaValida,
  mapearFieldData,
  processarLeadgen,
} from '../src/handlers/metaLeadWebhook.js';
import { processarLead, normalizarTelefoneBR, soDigitos } from '../src/services/processarLead.js';

// ------------------------------------------------------------------ //
// 1) Assinatura X-Hub-Signature-256 sobre o corpo CRU                 //
// ------------------------------------------------------------------ //

test('assinatura válida sobre o corpo cru (Buffer)', () => {
  const secret = 'app-secret-xyz';
  const raw = Buffer.from(JSON.stringify({ object: 'page', entry: [] }), 'utf8');
  const header = 'sha256=' + createHmac('sha256', secret).update(raw).digest('hex');
  assert.equal(assinaturaValida(raw, header, secret), true);
});

test('assinatura inválida → false (header errado, ausente, sem secret)', () => {
  const raw = Buffer.from('{"object":"page"}', 'utf8');
  assert.equal(assinaturaValida(raw, 'sha256=deadbeef', 'app-secret-xyz'), false);
  assert.equal(assinaturaValida(raw, undefined, 'app-secret-xyz'), false);
  assert.equal(assinaturaValida(raw, 'sha256=abc', ''), false); // sem secret → fail-closed
  assert.equal(assinaturaValida(null, 'sha256=abc', 's'), false); // sem corpo
});

test('assinatura falha se o corpo foi adulterado após assinar', () => {
  const secret = 's3cr3t';
  const raw = Buffer.from('{"a":1}', 'utf8');
  const header = 'sha256=' + createHmac('sha256', secret).update(raw).digest('hex');
  const adulterado = Buffer.from('{"a":2}', 'utf8');
  assert.equal(assinaturaValida(adulterado, header, secret), false);
});

// ------------------------------------------------------------------ //
// 2) Normalização de telefone                                         //
// ------------------------------------------------------------------ //

test('normalizarTelefoneBR: prefixa 55 em número nacional e preserva DDI', () => {
  assert.equal(normalizarTelefoneBR('+55 65 99999-1234'), '5565999991234');
  assert.equal(normalizarTelefoneBR('(65) 98888-0000'), '5565988880000'); // 11 díg → +55
  assert.equal(normalizarTelefoneBR('6532230000'), '556532230000');        // 10 díg (fixo) → +55
  assert.equal(soDigitos('(65) 9 9999-0000'), '65999990000');             // só dígitos, sem DDI
});

// ------------------------------------------------------------------ //
// 3) Mapeamento do field_data do Graph                                //
// ------------------------------------------------------------------ //

test('mapeia full_name / phone / email / objetivo + atribuição', () => {
  const data = {
    id: 'L1',
    created_time: '2026-06-22T10:00:00+0000',
    ad_id: 'AD123',
    form_id: 'FORM9',
    field_data: [
      { name: 'full_name', values: ['João da Silva'] },
      { name: 'phone_number', values: ['+55 65 99999-1234'] },
      { name: 'email', values: ['joao@exemplo.com'] },
      { name: 'objetivo', values: ['Investir'] },
    ],
  };
  const m = mapearFieldData(data, { objetivoKey: 'objetivo' });
  assert.equal(m.nome, 'João da Silva');
  assert.equal(m.telefone, '5565999991234');
  assert.equal(m.email, 'joao@exemplo.com');
  assert.equal(m.intencao, 'Investir');
  assert.equal(m.adId, 'AD123');
  assert.equal(m.formId, 'FORM9');
  assert.ok(m.consentimentoEm, 'consentimentoEm deve vir do created_time');
});

test('mapeia first_name + last_name quando não há full_name', () => {
  const data = {
    field_data: [
      { name: 'first_name', values: ['Maria'] },
      { name: 'last_name', values: ['Souza'] },
      { name: 'phone_number', values: ['65 98888-0000'] },
    ],
  };
  const m = mapearFieldData(data, { objetivoKey: 'objetivo' });
  assert.equal(m.nome, 'Maria Souza');
  assert.equal(m.telefone, '5565988880000');
});

test('campo "objetivo" via key custom do env (fallback gracioso)', () => {
  const data = { field_data: [{ name: 'qual_o_seu_objetivo', values: ['Morar'] }] };
  assert.equal(mapearFieldData(data, { objetivoKey: 'qual_o_seu_objetivo' }).intencao, 'Morar');
  // sem a key custom, ainda acha por fallback se o campo se chamar "objetivo":
  const data2 = { field_data: [{ name: 'objetivo', values: ['Construir'] }] };
  assert.equal(mapearFieldData(data2, { objetivoKey: 'inexistente' }).intencao, 'Construir');
});

// ------------------------------------------------------------------ //
// 4) Idempotência por leadgen_id (mesmo lead 2x → processa 1x)        //
// ------------------------------------------------------------------ //

function fakeDeps({ createLeadThrows = false } = {}) {
  const processados = new Set();
  const createLeadCalls = [];
  const eventos = [];
  const fakeDb = {
    leadgenJaProcessado: async (id) => processados.has(id),
    marcarLeadgenProcessado: async (id) => { processados.add(id); },
    createLead: async (d) => {
      if (createLeadThrows) throw new Error('db indisponível');
      createLeadCalls.push(d);
      return { ...d, id: createLeadCalls.length };
    },
    registrarEvento: async (phone, tipo, payload) => { eventos.push({ phone, tipo, payload }); },
  };
  const fakePraedium = { enviarLead: async () => ({ ok: true }) };
  const fakeBrevo = { adicionarContato: async () => ({ ok: true }) };
  const fakeMetaLeads = {
    buscarLead: async () => ({
      ok: true,
      data: {
        id: 'L1',
        created_time: '2026-06-22T10:00:00+0000',
        field_data: [
          { name: 'full_name', values: ['Lead Teste'] },
          { name: 'phone_number', values: ['+5565999990000'] },
          { name: 'email', values: ['lead@x.com'] },
        ],
      },
    }),
  };
  // injeta as fakes também dentro do processarLead real:
  const wrappedProcessarLead = (lead, o) =>
    processarLead(lead, { ...o, deps: { db: fakeDb, praedium: fakePraedium, brevo: fakeBrevo } });
  return {
    deps: { db: fakeDb, metaLeads: fakeMetaLeads, processarLead: wrappedProcessarLead },
    createLeadCalls, eventos, processados,
  };
}

test('idempotência: mesmo leadgen_id processado só uma vez', async () => {
  const f = fakeDeps();
  const value = { leadgen_id: 'L1', ad_id: 'A', form_id: 'F' };
  const r1 = await processarLeadgen(value, { deps: f.deps });
  const r2 = await processarLeadgen(value, { deps: f.deps });
  assert.equal(f.createLeadCalls.length, 1, 'createLead chamado uma única vez');
  assert.equal(r1.ok, true);
  assert.equal(r2.duplicate, true);
});

test('processarLeadgen grava fonte=meta_form e evento de atribuição', async () => {
  const f = fakeDeps();
  await processarLeadgen({ leadgen_id: 'L1', ad_id: 'A', form_id: 'F' }, { deps: f.deps });
  assert.equal(f.createLeadCalls[0].fonte, 'meta_form');
  assert.equal(f.createLeadCalls[0].phone, '5565999990000');
  const ev = f.eventos.find((e) => e.tipo === 'lead_meta_form');
  assert.ok(ev, 'deve registrar evento lead_meta_form');
  assert.equal(ev.payload.meta.adId, 'A');
});

test('processarLeadgen lança (→500) quando a persistência falha', async () => {
  const f = fakeDeps({ createLeadThrows: true });
  await assert.rejects(
    () => processarLeadgen({ leadgen_id: 'L1' }, { deps: f.deps }),
    /persistencia_falhou/,
  );
  // não marcou idempotência → o reenvio do Meta vai reprocessar
  assert.equal(f.processados.has('L1'), false);
});

test('processarLeadgen lança (→500) quando o Graph não responde', async () => {
  const f = fakeDeps();
  f.deps.metaLeads = { buscarLead: async () => ({ ok: false, erro: 'token_expirado', status: 400 }) };
  await assert.rejects(
    () => processarLeadgen({ leadgen_id: 'L1' }, { deps: f.deps }),
    /graph_fetch_falhou/,
  );
});

// ------------------------------------------------------------------ //
// 5) processarLead — regressão do /cadastro (mesma lógica downstream) //
// ------------------------------------------------------------------ //

function leadDeps() {
  const calls = { createLead: 0, praedium: 0, brevo: 0, lastCreate: null, lastPraedium: null };
  const deps = {
    db: { createLead: async (d) => { calls.createLead++; calls.lastCreate = d; return d; } },
    praedium: { enviarLead: async (p) => { calls.praedium++; calls.lastPraedium = p; return { ok: true }; } },
    brevo: { adicionarContato: async () => { calls.brevo++; return { ok: true }; } },
  };
  return { deps, calls };
}

test('/cadastro: e-mail válido → createLead + Praedium + Brevo; shape de retorno', async () => {
  const { deps, calls } = leadDeps();
  const r = await processarLead(
    {
      nome: 'Ana', telefone: '(65) 99999-0000', email: 'ana@x.com',
      intencao: 'morar', origem: 'landing:botanique-residence',
      fonte: 'landing:botanique-residence:VIP', consentimentoEm: '2026-06-22T00:00:00.000Z',
      mensagemCrm: 'Cadastro VIP via landing', brevoListId: 7,
    },
    { deps },
  );
  assert.equal(calls.createLead, 1);
  assert.equal(calls.praedium, 1);
  assert.equal(calls.brevo, 1);
  assert.equal(r.ok, true);
  assert.equal(r.persistido, true);
  assert.equal(r.emailValido, true);
  // o /cadastro mapeia r.praedium?.ok e r.brevo?.ok no corpo da resposta:
  assert.equal(r.praedium.ok, true);
  assert.equal(r.brevo.ok, true);
  // telefone persistido só com dígitos (comportamento histórico do /cadastro):
  assert.equal(calls.lastCreate.phone, '65999990000');
  assert.equal(calls.lastCreate.fonte, 'landing:botanique-residence:VIP');
});

test('/cadastro: sem e-mail → Brevo pulado, Praedium recebe email null', async () => {
  const { deps, calls } = leadDeps();
  const r = await processarLead(
    { nome: 'Bob', telefone: '5565999990000', origem: 'landing:x', fonte: 'landing:x:VIP' },
    { deps },
  );
  assert.equal(calls.brevo, 0);
  assert.equal(r.brevo.pulado, true);
  assert.equal(r.emailValido, false);
  assert.equal(calls.lastPraedium.email, null);
});

test('/cadastro: e-mail inválido não vaza para Brevo nem Praedium', async () => {
  const { deps, calls } = leadDeps();
  const r = await processarLead(
    { nome: 'Cau', telefone: '5565999990000', email: 'nao-eh-email', origem: 'x', fonte: 'y' },
    { deps },
  );
  assert.equal(calls.brevo, 0);
  assert.equal(r.emailValido, false);
  assert.equal(calls.lastPraedium.email, null);
});

test('processarLead NÃO lança quando o banco cai (persistido=false, segue downstream)', async () => {
  const calls = { praedium: 0 };
  const deps = {
    db: { createLead: async () => { throw new Error('db down'); } },
    praedium: { enviarLead: async () => { calls.praedium++; return { ok: true }; } },
    brevo: { adicionarContato: async () => ({ ok: true }) },
  };
  const r = await processarLead(
    { nome: 'Dan', telefone: '5565999990000', email: 'dan@x.com', origem: 'x', fonte: 'y' },
    { deps },
  );
  assert.equal(r.ok, true);
  assert.equal(r.persistido, false); // ← o que faz o webhook do Meta devolver 500
  assert.equal(calls.praedium, 1, 'mesmo sem persistir, o /cadastro segue para o CRM (comportamento histórico)');
});

test('processarLead NÃO registra evento de atribuição sem metadado meta (paridade /cadastro)', async () => {
  const eventos = [];
  const deps = {
    db: {
      createLead: async (d) => d,
      registrarEvento: async (p, t) => { eventos.push(t); },
    },
    praedium: { enviarLead: async () => ({ ok: true }) },
    brevo: { adicionarContato: async () => ({ ok: true }) },
  };
  await processarLead({ nome: 'Eva', telefone: '5565999990000', origem: 'x', fonte: 'landing:x:VIP' }, { deps });
  assert.equal(eventos.length, 0, '/cadastro não passa meta → nenhum evento extra gravado');
});
