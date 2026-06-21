// integrations/praedium.js — envio de lead para o CRM Praedium (Webhook de Entrada).
//
// fetch nativo. Não bloqueia o fluxo: se não estiver configurado, apenas loga.

/**
 * Envia um lead para o Webhook de Entrada do Praedium.
 * @param {{nome?:string, phone?:string, telefone?:string, origem?:string, mensagem?:string}} lead
 * @returns {Promise<{ok:boolean, status?:number, pulado?:boolean, erro?:string}>}
 */
export async function enviarLead(lead) {
  const url = process.env.PRAEDIUM_WEBHOOK_IN_URL;

  // Sem URL configurada → não bloqueia o fluxo.
  if (!url) {
    console.log('[Praedium] não configurado ainda (PRAEDIUM_WEBHOOK_IN_URL vazio) — pulando.');
    return { ok: true, pulado: true };
  }

  // TODO VALIDAR: ajustar os nomes dos campos ao formato exato do Webhook de
  // Entrada do Praedium (confirmar no painel deles).
  const payload = {
    nome: lead?.nome ?? null,
    telefone: lead?.phone ?? lead?.telefone ?? null,
    email: lead?.email ?? null,
    origem: lead?.origem ?? 'whatsapp',
    mensagem: lead?.mensagem ?? null,
    observacao: 'Lead via WhatsApp/landing',
  };

  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!resp.ok) {
      console.error(`[Praedium] falha HTTP ${resp.status} ao enviar lead.`);
      return { ok: false, status: resp.status };
    }
    console.log(`[Praedium] lead enviado (status ${resp.status}).`);
    return { ok: true, status: resp.status };
  } catch (err) {
    // Não logar a URL (pode conter token no path/query).
    console.error('[Praedium] erro ao enviar lead:', err?.message || err);
    return { ok: false, erro: err?.message || String(err) };
  }
}

/**
 * Atualiza o estágio do lead no Praedium (stub para o 0.7).
 * @param {string} leadId
 * @param {string} stage
 */
export async function atualizarEstagio(leadId, stage) {
  // TODO VALIDAR: implementar quando a API/credencial do Praedium estiver definida.
}
