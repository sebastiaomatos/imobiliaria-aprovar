// integrations/zapi.js — WhatsApp via Z-API.
//
// Usa ZAPI_INSTANCE_ID, ZAPI_INSTANCE_TOKEN e o header Client-Token
// (ZAPI_CLIENT_TOKEN), lidos de process.env. fetch nativo do Node.

/**
 * Envia uma mensagem de texto pelo WhatsApp via Z-API.
 * @param {string} phone   Telefone do destinatário (só dígitos, ex.: "5565999999999").
 * @param {string} message Texto da mensagem.
 * @returns {Promise<{ok:boolean, status?:number, data?:any, erro?:string}>}
 */
export async function sendText(phone, message) {
  const { ZAPI_INSTANCE_ID, ZAPI_INSTANCE_TOKEN, ZAPI_CLIENT_TOKEN } = process.env;

  // Defensivo: sem credenciais não tentamos enviar (e não derrubamos o fluxo).
  if (!ZAPI_INSTANCE_ID || !ZAPI_INSTANCE_TOKEN || !ZAPI_CLIENT_TOKEN) {
    console.error(`[Z-API sendText] credenciais ausentes — não enviei para ${phone}.`);
    return { ok: false, erro: 'credenciais_ausentes' };
  }

  // ATENÇÃO: a URL contém o token da instância — NUNCA logar a URL nem os headers.
  const url = `https://api.z-api.io/instances/${ZAPI_INSTANCE_ID}/token/${ZAPI_INSTANCE_TOKEN}/send-text`;

  try {
    // TODO VALIDAR: confirmar formato exato do endpoint/headers/body com a Z-API real.
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Client-Token': ZAPI_CLIENT_TOKEN,
      },
      body: JSON.stringify({ phone, message }),
      signal: AbortSignal.timeout(8000), // não pendurar o fluxo se a Z-API travar
    });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      console.error(`[Z-API sendText] falha HTTP ${resp.status} ao enviar para ${phone}:`, data);
      return { ok: false, status: resp.status, data };
    }
    console.log(`[Z-API sendText] enviado para ${phone} (status ${resp.status}).`);
    return { ok: true, status: resp.status, data };
  } catch (err) {
    // Loga só a mensagem do erro, nunca a URL com token.
    console.error(`[Z-API sendText] erro ao enviar para ${phone}:`, err?.message || err);
    return { ok: false, erro: err?.message || String(err) };
  }
}
