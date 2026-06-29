// test/brevo.test.js — mapeamento de telefone → E.164 (núcleo do fix do Brevo).
// Função pura, sem rede: garante "+55DDDNUMERO" e null defensivo p/ inválidos.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { telefoneParaE164BR } from '../src/integrations/brevo.js';

test('E.164: nacional móvel 11 dígitos (formato livre) → +55…', () => {
  assert.equal(telefoneParaE164BR('(65) 99999-0000'), '+5565999990000');
  assert.equal(telefoneParaE164BR('65999990000'), '+5565999990000');
});

test('E.164: já com DDI (13 dígitos) → preserva', () => {
  assert.equal(telefoneParaE164BR('5565999990000'), '+5565999990000');
});

test('E.164: fixo nacional 10 dígitos → +55… (12 dígitos)', () => {
  assert.equal(telefoneParaE164BR('6532321234'), '+556532321234');
});

test('E.164: vazio/curto/nulo → null (não derruba a criação do contato)', () => {
  assert.equal(telefoneParaE164BR(''), null);
  assert.equal(telefoneParaE164BR('99999'), null);
  assert.equal(telefoneParaE164BR(null), null);
  assert.equal(telefoneParaE164BR(undefined), null);
});

test('E.164: não-BR (13 dígitos sem 55) → null', () => {
  assert.equal(telefoneParaE164BR('1415552671234'), null);
});
