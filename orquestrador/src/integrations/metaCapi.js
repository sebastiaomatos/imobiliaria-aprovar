// integrations/metaCapi.js — eventos server-side para a Meta Conversions API.
//
// Requer META_CAPI_TOKEN e META_PIXEL_ID (dataset). Melhora o rastreamento de
// conversões (Lead, Schedule, etc.) sem depender só do Pixel no navegador.
// Implementar com o fetch nativo do Node (sem node-fetch).

/**
 * Envia um evento de conversão para a Meta CAPI.
 * @param {string} eventName    Ex.: "Lead", "Schedule".
 * @param {object} userData     Dados do usuário (hasheados quando exigido).
 * @param {object} [customData] Dados adicionais do evento.
 * @returns {Promise<void>}
 */
export async function sendConversionEvent(eventName, userData, customData) {
  // TODO(0.7): POST https://graph.facebook.com/v21.0/<META_PIXEL_ID>/events
  //   ?access_token=META_CAPI_TOKEN
  //   body: { data: [{ event_name: eventName, event_time, user_data: userData, custom_data: customData }] }
}
