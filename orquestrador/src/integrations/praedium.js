// integrations/praedium.js — CRM Praedium (leads e estágios do funil).
//
// Requer plano com webhooks/LeadSync/API e a credencial PRAEDIUM_API_KEY.
// Implementar com o fetch nativo do Node (sem node-fetch).

/**
 * Cria ou atualiza um lead no CRM.
 * @param {object} lead Dados do lead vindos do POST /webhook/lead.
 * @returns {Promise<void>}
 */
export async function upsertLead(lead) {
  // TODO(0.7): chamar a API do Praedium para criar/atualizar o lead.
}

/**
 * Move o lead para um estágio do funil (ex.: "Visita agendada").
 * @param {string} leadId
 * @param {string} stage
 * @returns {Promise<void>}
 */
export async function updateLeadStage(leadId, stage) {
  // TODO(0.7): chamar a API do Praedium para atualizar o estágio do lead.
}
