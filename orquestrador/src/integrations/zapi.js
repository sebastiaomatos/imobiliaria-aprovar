// integrations/zapi.js — WhatsApp via Z-API.
//
// Usa ZAPI_INSTANCE_ID, ZAPI_INSTANCE_TOKEN e o header Client-Token
// (ZAPI_CLIENT_TOKEN). Implementar com o fetch nativo do Node (sem node-fetch).

/**
 * Envia uma mensagem de texto pelo WhatsApp (ex.: a M0 do fluxo).
 * @param {string} phone   Telefone do destinatário (ex.: "5565999999999").
 * @param {string} message Texto da mensagem.
 * @returns {Promise<void>}
 */
export async function sendWhatsAppMessage(phone, message) {
  // TODO(0.7): POST https://api.z-api.io/instances/<ID>/token/<TOKEN>/send-text
  //   headers: { 'Content-Type': 'application/json', 'Client-Token': ZAPI_CLIENT_TOKEN }
  //   body:    { phone, message }
}
