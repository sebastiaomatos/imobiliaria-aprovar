// handlers/zapiWebhook.js — processa as mensagens recebidas do WhatsApp (Z-API).
//
// Chamado de forma assíncrona pelo server (responde 200 antes de processar).
// NUNCA lança: captura tudo e loga, para não derrubar o processo.

import * as db from '../db.js';
import * as zapi from '../integrations/zapi.js';
import * as praedium from '../integrations/praedium.js';
import * as metaCapi from '../integrations/metaCapi.js';
// import * as brevo from '../integrations/brevo.js'; // ativar quando o lead trouxer e-mail
import { MENSAGENS, AGENDA_RECUPERACAO, OPTOUT_KEYS, AVISTA_KEYS, preencher } from '../regua.js';

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
 */
export async function processarWebhookZapi(body, log = console) {
  try {
    // 1) Ignora o que não for mensagem de texto de pessoa.
    if (deveIgnorar(body)) {
      log.info?.('[zapiWebhook] evento ignorado (não é mensagem de texto de pessoa).');
      return;
    }

    // 2) Segurança leve: se a instância vier e não bater com a nossa, ignora.
    //    (defensivo: só checa quando ZAPI_INSTANCE_ID está configurado)
    if (body.instanceId && process.env.ZAPI_INSTANCE_ID && body.instanceId !== process.env.ZAPI_INSTANCE_ID) {
      log.warn?.('[zapiWebhook] instanceId divergente — ignorando.');
      return;
    }

    // 3) Extrai campos.
    const phone = body.phone;
    const nome = body.senderName || body.chatName || 'tudo bem';
    const texto = body.text.message;
    const textoLower = String(texto).toLowerCase();

    if (!phone) {
      log.warn?.('[zapiWebhook] sem phone no corpo — ignorando.');
      return;
    }

    // 4) Opt-out: descadastra, cancela régua, confirma e encerra.
    if (contemAlguma(textoLower, OPTOUT_KEYS)) {
      await db.updateLead(phone, { optout: true });
      await db.cancelarAgendamentosPendentes(phone);
      await zapi.sendText(phone, preencher(MENSAGENS.OPTOUT, nome));
      await db.registrarEvento(phone, 'optout', { texto });
      log.info?.(`[zapiWebhook] opt-out de ${phone}.`);
      return;
    }

    // 5) Lead novo x lead existente.
    const lead = await db.getLeadByPhone(phone);

    if (!lead) {
      // ===== LEAD NOVO =====
      await db.createLead({ phone, nome, origem: 'whatsapp', estagio: 'novo' });

      // Envia ao CRM (não bloqueia se não estiver configurado).
      await praedium.enviarLead({ phone, nome, origem: 'whatsapp', mensagem: texto });

      // quando houver e-mail do lead (hoje é WhatsApp-only; ativar quando o e-mail
      // vier de Lead Ads ou de um campo no formulário):
      // await brevo.adicionarContato(email, nome);

      // Mensagem inicial (M0).
      await zapi.sendText(phone, preencher(MENSAGENS.M0, nome));

      // Agenda a régua de recuperação (R1..R5b).
      await db.agendarMensagens(phone, montarAgenda());

      // Sinal de alta intenção (à vista / recurso próprio) → prioriza e avisa o corretor já.
      if (contemAlguma(textoLower, AVISTA_KEYS)) {
        await db.updateLead(phone, { prioridade: true });
        const corretor = process.env.CORRETOR_WHATSAPP;
        if (corretor) {
          await zapi.sendText(
            corretor,
            `⭐ LEAD PRIORITÁRIO (possível à vista/alta renda)! Nome: ${nome} | WhatsApp: ${phone} | Msg: "${texto}". Atenda agora.`,
          );
        } else {
          log.warn?.('[zapiWebhook] CORRETOR_WHATSAPP não definido — não avisei sobre lead prioritário.');
        }
        await db.registrarEvento(phone, 'lead_prioritario', { texto });
      }

      await db.registrarEvento(phone, 'lead_novo', { nome, texto });
      log.info?.(`[zapiWebhook] lead NOVO criado: ${phone}.`);
      return;
    }

    // ===== LEAD EXISTENTE (respondeu = engajou) =====
    // a) para a régua de recuperação.
    await db.cancelarAgendamentosPendentes(phone);
    // b) muda o estágio.
    await db.updateLead(phone, { estagio: 'em_atendimento' });
    // c) notifica o corretor para assumir.
    const corretor = process.env.CORRETOR_WHATSAPP;
    if (corretor) {
      await zapi.sendText(
        corretor,
        `🔔 Lead respondeu! Nome: ${nome} | WhatsApp: ${phone} | Msg: "${texto}". Assuma a conversa.`,
      );
    } else {
      log.warn?.('[zapiWebhook] CORRETOR_WHATSAPP não definido — não notifiquei a resposta do lead.');
    }
    // d) evento de conversão server-side.
    await metaCapi.enviarEvento('conversa_iniciada', { phone });
    // e) auditoria.
    await db.registrarEvento(phone, 'conversa_iniciada', { texto });
    // f) NÃO envia mais mensagens automáticas — o humano assume.
    log.info?.(`[zapiWebhook] lead ${phone} engajou — humano assume.`);
  } catch (err) {
    log.error?.(`[zapiWebhook] erro ao processar: ${err?.message || err}`);
  }
}
