// test/_fakes.js — fakes com estado para os testes (sem banco/rede).
// (Prefixo "_" → não casa com o glob *.test.js, então não roda como suíte.)

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/**
 * Banco fake com estado: replica a semântica de upsert/COALESCE relevante do
 * createLead real (fonte/consentimento/email COALESCE; whatsapp_optin monotônico;
 * flags de controle preservadas no conflito).
 */
export function criarDbFake(seed = []) {
  const leads = new Map(); // phone -> row
  let seqId = 0;
  const eventos = [];
  const agendamentos = []; // {phone, etapa, status}
  const messageIds = new Set();
  const leadgens = new Set();

  for (const s of seed) leads.set(s.phone, { id: ++seqId, optout: false, prioridade: false, m0_ativa_enviada: false, corretor_notificado: false, whatsapp_optout_em: null, whatsapp_optin: false, email: null, estagio: 'novo', ...s });

  const copia = (row) => (row ? { ...row } : null);

  return {
    _leads: leads,
    _eventos: eventos,
    _agendamentos: agendamentos,

    async createLead(d) {
      const phone = d.phone;
      const existente = leads.get(phone);
      const emailValido = EMAIL_RE.test(String(d.email || '').trim()) ? String(d.email).trim() : null;
      if (existente) {
        existente.fonte = existente.fonte ?? d.fonte ?? null;
        existente.consentimento_em = existente.consentimento_em ?? d.consentimentoEm ?? null;
        existente.email = existente.email ?? emailValido;
        existente.whatsapp_optin = existente.whatsapp_optin || d.whatsappOptin === true;
        return copia(existente);
      }
      const row = {
        id: ++seqId,
        phone,
        nome: d.nome ?? null,
        origem: d.origem ?? null,
        intencao: d.intencao ?? null,
        estagio: d.estagio ?? 'novo',
        fonte: d.fonte ?? null,
        consentimento_em: d.consentimentoEm ?? null,
        email: emailValido,
        whatsapp_optin: d.whatsappOptin === true,
        m0_ativa_enviada: false,
        corretor_notificado: false,
        whatsapp_optout_em: null,
        optout: false,
        prioridade: false,
      };
      leads.set(phone, row);
      return copia(row);
    },

    async updateLead(phone, campos) {
      const row = leads.get(phone);
      if (!row) return null;
      Object.assign(row, campos);
      return copia(row);
    },

    async getLeadByPhone(phone) {
      return copia(leads.get(phone));
    },

    async registrarEvento(phone, tipo, payload = {}) {
      eventos.push({ phone, tipo, payload });
    },

    async agendarMensagens(phone, lista) {
      for (const item of lista || []) agendamentos.push({ phone, etapa: item.etapa, status: 'pendente' });
    },

    async cancelarAgendamentosPendentes(phone) {
      let n = 0;
      for (const a of agendamentos) if (a.phone === phone && a.status === 'pendente') { a.status = 'cancelado'; n++; }
      return n;
    },

    async registrarMensagemProcessada(messageId) {
      if (!messageId) return true;
      if (messageIds.has(messageId)) return false;
      messageIds.add(messageId);
      return true;
    },

    async leadgenJaProcessado(id) {
      return leadgens.has(id);
    },
    async marcarLeadgenProcessado(id) {
      if (id) leadgens.add(id);
    },
  };
}

/** Integrações fake que registram chamadas. zapi/praedium/brevo/metaCapi. */
export function criarIntegracoesFake({ zapiOk = true } = {}) {
  const calls = { zapi: [], praedium: [], brevoAdd: [], brevoDesinscrever: [], metaCapi: [] };
  return {
    calls,
    zapi: {
      async sendText(phone, message) { calls.zapi.push({ phone, message }); return { ok: zapiOk, status: zapiOk ? 200 : 500 }; },
    },
    praedium: {
      async enviarLead(p) { calls.praedium.push(p); return { ok: true }; },
    },
    brevo: {
      async adicionarContato(email, nome, listId) { calls.brevoAdd.push({ email, nome, listId }); return { ok: true }; },
      async desinscrever(email) { calls.brevoDesinscrever.push({ email }); return { ok: true }; },
    },
    metaCapi: {
      async enviarEvento(nome, dados) { calls.metaCapi.push({ nome, dados }); return { ok: true }; },
    },
  };
}

/** Helpers p/ inspecionar os envios do Z-API. */
export const ehM0Ativa = (m) => /assistente virtual da Aprovar Neg/i.test(m.message);
export const ehNotificacaoCorretor = (m) => /Novo lead VIP/i.test(m.message);
