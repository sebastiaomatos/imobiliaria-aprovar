// worker.js — processa a régua de recuperação a cada 60s.
//
// A cada tique: busca agendamentos vencidos (status 'pendente' e enviar_em <= agora),
// e para cada um decide enviar a mensagem da etapa (R1..R5) ou cancelar.

import * as db from './db.js';
import * as zapi from './integrations/zapi.js';
import { textoDaEtapa, preencher } from './regua.js';

const INTERVALO_MS = 60 * 1000;

/** Processa uma rodada de agendamentos vencidos. */
export async function processarVencidos(log = console) {
  let vencidos;
  try {
    vencidos = await db.pegarAgendamentosVencidos();
  } catch (err) {
    log.error?.(`[worker] erro ao buscar agendamentos vencidos: ${err?.message || err}`);
    return;
  }
  if (!vencidos || vencidos.length === 0) return;

  log.info?.(`[worker] ${vencidos.length} agendamento(s) vencido(s) para processar.`);

  for (const ag of vencidos) {
    try {
      const lead = await db.getLeadByPhone(ag.lead_phone);

      // Defensivo: lead inexistente, opt-out ou já em atendimento → cancela e pula.
      if (!lead || lead.optout || lead.estagio === 'em_atendimento') {
        await db.marcarAgendamento(ag.id, 'cancelado');
        log.info?.(`[worker] agendamento ${ag.id} (${ag.etapa}) cancelado (lead indisponível/optout/em_atendimento).`);
        continue;
      }

      const texto = textoDaEtapa(ag.etapa);
      if (!texto) {
        await db.marcarAgendamento(ag.id, 'cancelado');
        log.warn?.(`[worker] etapa desconhecida "${ag.etapa}" (agendamento ${ag.id}) — cancelado.`);
        continue;
      }

      const r = await zapi.sendText(ag.lead_phone, preencher(texto, lead.nome));
      // Marca 'enviado' no sucesso; 'erro' na falha (evita reprocessar em loop).
      await db.marcarAgendamento(ag.id, r?.ok ? 'enviado' : 'erro');
      await db.registrarEvento(ag.lead_phone, 'regua_' + ag.etapa, { ok: r?.ok ?? false });
      log.info?.(`[worker] etapa ${ag.etapa} -> ${ag.lead_phone}: ${r?.ok ? 'enviado' : 'erro'}.`);
    } catch (err) {
      log.error?.(`[worker] erro no agendamento ${ag.id}: ${err?.message || err}`);
      try { await db.marcarAgendamento(ag.id, 'erro'); } catch { /* ignora */ }
    }
  }
}

/** Inicia o loop do worker (a cada 60s). Retorna o timer. */
export function iniciarWorker(log = console) {
  log.info?.('[worker] iniciado (intervalo 60s).');
  const timer = setInterval(() => {
    processarVencidos(log);
  }, INTERVALO_MS);
  // Não impede o processo de encerrar por conta própria (o servidor o mantém vivo).
  if (timer.unref) timer.unref();
  return timer;
}
