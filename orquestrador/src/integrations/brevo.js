// integrations/brevo.js — e-mail marketing via Brevo.
//
// adicionarContato cria/atualiza o contato e o adiciona à lista BREVO_LIST_ID.
// É a ENTRADA NA LISTA que dispara a automação de e-mails configurada no Brevo.
// fetch nativo do Node.

/**
 * Cria/atualiza um contato no Brevo e o adiciona à lista (BREVO_LIST_ID).
 * @param {string} email E-mail do lead.
 * @param {string} nome  Nome do lead (vira o atributo NOME).
 * @returns {Promise<{ok:boolean, status?:number, data?:any, pulado?:boolean, erro?:string}>}
 */
export async function adicionarContato(email, nome) {
  const { BREVO_API_KEY, BREVO_LIST_ID } = process.env;

  // Defensivo: sem credencial/lista, não tentamos (e não quebramos o fluxo).
  if (!BREVO_API_KEY || !BREVO_LIST_ID) {
    console.log('[Brevo] não configurado (BREVO_API_KEY/BREVO_LIST_ID ausentes) — pulando.');
    return { ok: true, pulado: true };
  }

  // Defensivo: sem e-mail não há o que cadastrar.
  if (!email) {
    console.warn('[Brevo] adicionarContato chamado sem e-mail — ignorando.');
    return { ok: false, erro: 'email_ausente' };
  }

  try {
    // TODO VALIDAR: confirmar o nome do atributo (NOME) e o id da lista no painel do Brevo.
    const resp = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        email,
        attributes: { NOME: nome },
        listIds: [Number(BREVO_LIST_ID)],
        updateEnabled: true,
      }),
    });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      console.error(`[Brevo] falha HTTP ${resp.status} ao adicionar ${email}:`, data);
      return { ok: false, status: resp.status, data };
    }
    console.log(`[Brevo] contato adicionado/atualizado na lista ${BREVO_LIST_ID}: ${email} (status ${resp.status}).`);
    return { ok: true, status: resp.status, data };
  } catch (err) {
    console.error(`[Brevo] erro ao adicionar contato ${email}:`, err?.message || err);
    return { ok: false, erro: err?.message || String(err) };
  }
}
