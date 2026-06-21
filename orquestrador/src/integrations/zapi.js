// integrations/zapi.js — WhatsApp via Z-API.
//
// Usa ZAPI_INSTANCE_ID, ZAPI_INSTANCE_TOKEN e o header Client-Token
// (ZAPI_CLIENT_TOKEN), lidos de process.env. Usa o fetch nativo do Node.

/**
 * Envia uma mensagem de texto pelo WhatsApp via Z-API (ex.: a M0 do fluxo).
 * Já está pronta para uso, mas ainda NÃO é chamada em lugar nenhum.
 *
 * @param {string} phone   Telefone do destinatário (ex.: "5565999999999").
 * @param {string} message Texto da mensagem.
 * @returns {Promise<object|null>} Resposta da Z-API (JSON) ou null em caso de erro.
 */
export async function sendText(phone, message) {
  const { ZAPI_INSTANCE_ID, ZAPI_INSTANCE_TOKEN, ZAPI_CLIENT_TOKEN } = process.env;

  // ATENÇÃO: a URL contém o token da instância — NUNCA logar a URL nem os headers.
  const url = `https://api.z-api.io/instances/${ZAPI_INSTANCE_ID}/token/${ZAPI_INSTANCE_TOKEN}/send-text`;

  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Client-Token': ZAPI_CLIENT_TOKEN,
      },
      body: JSON.stringify({ phone, message }),
    });

    // Tenta ler o corpo de resposta como JSON (sem quebrar se vier vazio).
    const data = await resp.json().catch(() => ({}));

    if (!resp.ok) {
      // Loga status + corpo de erro, mas SEM a URL/headers (que contêm tokens).
      console.error(`[Z-API sendText] falha HTTP ${resp.status} ao enviar para ${phone}:`, data);
      return null;
    }

    console.log(`[Z-API sendText] mensagem enviada para ${phone} (status ${resp.status}).`);
    return data;
  } catch (err) {
    // Erro de rede/execução — loga só a mensagem do erro, nunca a URL com token.
    console.error(`[Z-API sendText] erro ao enviar para ${phone}:`, err?.message || err);
    return null;
  }
}
