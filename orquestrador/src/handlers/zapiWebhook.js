// handlers/zapiWebhook.js — processa as mensagens recebidas do WhatsApp (Z-API).
//
// Chamado de forma assíncrona pelo server (responde 200 antes de processar).
// NUNCA lança: captura tudo e loga, para não derrubar o processo.
//
// Dependências injetáveis via `deps` (só para testes); em produção usa os módulos
// reais por padrão.

import * as db from '../db.js';
import * as zapi from '../integrations/zapi.js';
import * as praedium from '../integrations/praedium.js';
import * as metaCapi from '../integrations/metaCapi.js';
import * as brevo from '../integrations/brevo.js';
import { MENSAGENS, AGENDA_RECUPERACAO, OPTOUT_KEYS, AVISTA_KEYS, ESCALADA_KEYS, preencher } from '../regua.js';

const MAX_TEXTO = 4000; // trunca textos absurdamente longos antes de processar/logar

/** Decide se devemos ignorar o evento (não é mensagem de texto de uma pessoa). */
function deveIgnorar(body) {
  if (!body || typeof body !== 'object') return true;
  if (body.fromMe === true) return true;        // mensagem enviada por nós
  if (body.isGroup === true) return true;        // grupos
  if (body.notification) return true;            // chamadas/notificações
  if (body.type !== 'ReceivedCallback') return true;
  if (!body.text?.message) return true;          // sem texto
  return false;
}

function contemAlguma(textoLower, chaves) {
  return chaves.some((k) => textoLower.includes(k));
}

/** Converte AGENDA_RECUPERACAO em [{etapa, enviar_em}] a partir de agora. */
function montarAgenda(agoraMs = Date.now()) {
  return AGENDA_RECUPERACAO.map(({ etapa, minutos }) => ({
    etapa,
    enviar_em: new Date(agoraMs + minutos * 60 * 1000).toISOString(),
  }));
}

/**
 * Processa o corpo do webhook da Z-API.
 * @param {object} body  Corpo enviado pela Z-API.
 * @param {object} [log] Logger (Fastify log ou console).
 * @param {object} [deps] Injeção p/ testes ({db, zapi, praedium, metaCapi, brevo}).
 */
export async function processarWebhookZapi(body, log = console, deps = {}) {
  const _db = deps.db || db;
  const _zapi = deps.zapi || zapi;
  const _praedium = deps.praedium || praedium;
  const _metaCapi = deps.metaCapi || metaCapi;
  const _brevo = deps.brevo || brevo;

  try {
    // 1) Ignora o que não for mensagem de texto de pessoa.
    if (deveIgnorar(body)) {
      log.info?.('[zapiWebhook] evento ignorado (não é mensagem de texto de pessoa).');
      return;
    }

    // 2) Segurança leve: se a instância vier e não bater com a nossa, ignora.
    if (body.instanceId && process.env.ZAPI_INSTANCE_ID && body.instanceId !== process.env.ZAPI_INSTANCE_ID) {
      log.warn?.('[zapiWebhook] instanceId divergente — ignorando.');
      return;
    }

    // 3) Extrai campos (trunca texto muito longo).
    const phone = body.phone;
    const nome = body.senderName || body.chatName || 'tudo bem';
    const texto = String(body.text.message).slice(0, MAX_TEXTO);
    const textoLower = texto.toLowerCase();

    if (!phone) {
      log.warn?.('[zapiWebhook] sem phone no corpo — ignorando.');
      return;
    }

    // 3.1) Idempotência: ignora reentregas do mesmo messageId.
    const novo = await _db.registrarMensagemProcessada(body.messageId);
    if (!novo) {
      log.info?.(`[zapiWebhook] messageId ${body.messageId} já processado — ignorando reentrega.`);
      return;
    }

    // 4) Opt-out: descadastra, cancela régua, reflete no Brevo, confirma e encerra.
    if (contemAlguma(textoLower, OPTOUT_KEYS)) {
      await _db.updateLead(phone, { optout: true, whatsapp_optout_em: new Date().toISOString() });
      await _db.cancelarAgendamentosPendentes(phone);
      // Reflete o descadastro no Brevo (best-effort; só se tivermos e-mail do lead).
      try {
        const leadAtual = await _db.getLeadByPhone(phone);
        if (leadAtual?.email) await _brevo.desinscrever(leadAtual.email);
      } catch (err) {
        log.warn?.(`[zapiWebhook] falha ao refletir opt-out no Brevo: ${err?.message || err}`);
      }
      await _zapi.sendText(phone, preencher(MENSAGENS.OPTOUT, nome));
      await _db.registrarEvento(phone, 'optout', { texto });
      log.info?.(`[zapiWebhook] opt-out de ${phone}.`);
      return;
    }

    // 4.1) Escalada humana (COFECI): lead pede corretor/atendente → handoff imediato.
    if (contemAlguma(textoLower, ESCALADA_KEYS)) {
      const existente = await _db.getLeadByPhone(phone);
      if (!existente) {
        await _db.createLead({ phone, nome, origem: 'whatsapp', estagio: 'em_atendimento', fonte: 'whatsapp' });
      } else {
        await _db.updateLead(phone, { estagio: 'em_atendimento' });
      }
      await _db.cancelarAgendamentosPendentes(phone);
      const rEsc = await _zapi.sendText(phone, preencher(MENSAGENS.ESCALADA, nome));
      if (!rEsc?.ok) log.warn?.(`[zapiWebhook] falha ao enviar ESCALADA para ${phone}: ${rEsc?.erro || rEsc?.status}`);
      const corretorEsc = process.env.CORRETOR_WHATSAPP;
      if (corretorEsc) {
        await _zapi.sendText(corretorEsc, `🙋 ESCALADA HUMANA pedida! Nome: ${nome} | WhatsApp: ${phone} | Msg: "${texto}". Assuma agora.`);
      } else {
        log.warn?.('[zapiWebhook] CORRETOR_WHATSAPP não definido — não avisei sobre a escalada.');
      }
      await _db.registrarEvento(phone, 'escalada_humana', { texto });
      log.info?.(`[zapiWebhook] escalada humana para ${phone} — humano assume.`);
      return;
    }

    // 5) Lead novo x lead existente.
    const lead = await _db.getLeadByPhone(phone);

    if (!lead) {
      // ===== LEAD NOVO =====
      await _db.createLead({ phone, nome, origem: 'whatsapp', estagio: 'novo', fonte: 'whatsapp' });

      // Envia ao CRM (não bloqueia se não estiver configurado).
      await _praedium.enviarLead({ phone, nome, origem: 'whatsapp', mensagem: texto });

      // Mensagem inicial (M0 inbound). Confere o retorno para auditoria.
      const rM0 = await _zapi.sendText(phone, preencher(MENSAGENS.M0, nome));
      if (!rM0?.ok) {
        log.warn?.(`[zapiWebhook] falha ao enviar M0 para ${phone}: ${rM0?.erro || rM0?.status}`);
        await _db.registrarEvento(phone, 'envio_falhou', { etapa: 'M0', erro: rM0?.erro || rM0?.status || 'desconhecido' });
      }

      // Agenda a régua de recuperação (R1..R5b).
      await _db.agendarMensagens(phone, montarAgenda());

      // Coordenação com a M0 ativa: este lead já iniciou conversa no WhatsApp, então
      // marca m0_ativa_enviada=true — se ele também vier por site/Meta, NÃO recebe a
      // M0 proativa (evita mensagem dupla).
      await _db.updateLead(phone, { m0_ativa_enviada: true });

      // Sinal de alta intenção (à vista / recurso próprio) → prioriza e avisa o corretor já.
      if (contemAlguma(textoLower, AVISTA_KEYS)) {
        await _db.updateLead(phone, { prioridade: true });
        const corretor = process.env.CORRETOR_WHATSAPP;
        if (corretor) {
          await _zapi.sendText(
            corretor,
            `⭐ LEAD PRIORITÁRIO (possível à vista/alta renda)! Nome: ${nome} | WhatsApp: ${phone} | Msg: "${texto}". Atenda agora.`,
          );
        } else {
          log.warn?.('[zapiWebhook] CORRETOR_WHATSAPP não definido — não avisei sobre lead prioritário.');
        }
        await _db.registrarEvento(phone, 'lead_prioritario', { texto });
      }

      await _db.registrarEvento(phone, 'lead_novo', { nome, texto });
      log.info?.(`[zapiWebhook] lead NOVO criado: ${phone}.`);
      return;
    }

    // ===== LEAD EXISTENTE (respondeu = engajou) =====
    // a) para a régua de recuperação.
    await _db.cancelarAgendamentosPendentes(phone);
    // b) muda o estágio.
    await _db.updateLead(phone, { estagio: 'em_atendimento' });
    // c) notifica o corretor para assumir.
    const corretor = process.env.CORRETOR_WHATSAPP;
    if (corretor) {
      await _zapi.sendText(
        corretor,
        `🔔 Lead respondeu! Nome: ${nome} | WhatsApp: ${phone} | Msg: "${texto}". Assuma a conversa.`,
      );
    } else {
      log.warn?.('[zapiWebhook] CORRETOR_WHATSAPP não definido — não notifiquei a resposta do lead.');
    }
    // d) evento de conversão server-side.
    await _metaCapi.enviarEvento('conversa_iniciada', { phone });
    // e) auditoria.
    await _db.registrarEvento(phone, 'conversa_iniciada', { texto });
    // f) NÃO envia mais mensagens automáticas — o humano assume.
    log.info?.(`[zapiWebhook] lead ${phone} engajou — humano assume.`);
  } catch (err) {
    log.error?.(`[zapiWebhook] erro ao processar: ${err?.message || err}`);
  }
}
