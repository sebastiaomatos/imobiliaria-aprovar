// integrations/brevo.js — e-mail transacional via Brevo.
//
// Requer BREVO_API_KEY. Implementar com o fetch nativo do Node (sem node-fetch).

/**
 * Envia um e-mail transacional (ex.: boas-vindas da sequência de e-mails).
 * @param {{ to: string, templateId?: number, subject?: string, params?: object }} opts
 * @returns {Promise<void>}
 */
export async function sendTransactionalEmail(opts) {
  // TODO(0.7): POST https://api.brevo.com/v3/smtp/email
  //   headers: { 'api-key': BREVO_API_KEY, 'Content-Type': 'application/json' }
  //   body:    { to: [{ email: opts.to }], templateId: opts.templateId, params: opts.params }
}
