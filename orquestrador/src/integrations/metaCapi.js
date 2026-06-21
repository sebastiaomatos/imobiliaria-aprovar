// integrations/metaCapi.js — eventos server-side para a Meta Conversions API.
//
// Requer META_PIXEL_ID e META_CAPI_TOKEN. META_GRAPH_VERSION é opcional
// (default v21.0). fetch nativo + crypto nativo para o hash do telefone.

import { createHash } from 'node:crypto';

/** Normaliza (só dígitos) e gera SHA-256 hex do telefone (exigido pela Meta). */
function hashTelefone(phone) {
  const digitos = String(phone || '').replace(/\D/g, '');
  return createHash('sha256').update(digitos).digest('hex');
}

/**
 * Envia um evento de conversão para a Meta CAPI.
 * @param {string} eventName Ex.: "conversa_iniciada".
 * @param {{phone:string}} dados
 * @returns {Promise<{ok:boolean, status?:number, data?:any, pulado?:boolean, erro?:string}>}
 */
export async function enviarEvento(eventName, { phone } = {}) {
  const { META_PIXEL_ID, META_CAPI_TOKEN } = process.env;
  const version = process.env.META_GRAPH_VERSION || 'v21.0';

  // Defensivo: sem credenciais, não tentamos (não bloqueia o fluxo).
  if (!META_PIXEL_ID || !META_CAPI_TOKEN) {
    console.log(`[Meta CAPI] não configurado (META_PIXEL_ID/META_CAPI_TOKEN ausentes) — pulando "${eventName}".`);
    return { ok: true, pulado: true };
  }

  // ATENÇÃO: a URL contém o access_token na query — NUNCA logar a URL.
  const url = `https://graph.facebook.com/${version}/${META_PIXEL_ID}/events?access_token=${META_CAPI_TOKEN}`;
  const body = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'business_messaging',
        user_data: { ph: [hashTelefone(phone)] },
      },
    ],
  };

  try {
    // TODO VALIDAR: confirmar action_source/user_data exigidos pela Meta para mensageria.
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      console.error(`[Meta CAPI] falha HTTP ${resp.status} no evento "${eventName}":`, data);
      return { ok: false, status: resp.status, data };
    }
    console.log(`[Meta CAPI] evento "${eventName}" enviado (status ${resp.status}).`);
    return { ok: true, status: resp.status, data };
  } catch (err) {
    console.error(`[Meta CAPI] erro no evento "${eventName}":`, err?.message || err);
    return { ok: false, erro: err?.message || String(err) };
  }
}
