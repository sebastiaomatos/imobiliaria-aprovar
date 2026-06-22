// integrations/brevo.js — e-mail marketing via Brevo.
//
// adicionarContato cria/atualiza o contato e o adiciona à lista BREVO_LIST_ID.
// É a ENTRADA NA LISTA que dispara a automação de e-mails configurada no Brevo.
// fetch nativo do Node.

/**
 * Cria/atualiza um contato no Brevo e o adiciona a uma lista.
 * @param {string} email E-mail do lead.
 * @param {string} nome  Nome do lead (vira o atributo NOME).
 * @param {string|number} [listId] ID da lista; default BREVO_LIST_ID (use
 *   BREVO_LIST_ID_VIP para o cadastro da landing).
 * @returns {Promise<{ok:boolean, status?:number, data?:any, pulado?:boolean, erro?:string}>}
 */
export async function adicionarContato(email, nome, listId = process.env.BREVO_LIST_ID) {
  const { BREVO_API_KEY } = process.env;

  // Defensivo: sem credencial/lista, não tentamos (e não quebramos o fluxo).
  if (!BREVO_API_KEY || !listId) {
    console.log('[Brevo] não configurado (BREVO_API_KEY/lista ausentes) — pulando.');
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
        listIds: [Number(listId)],
        updateEnabled: true,
      }),
      signal: AbortSignal.timeout(8000), // não bloquear o /cadastro se o Brevo travar
    });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      console.error(`[Brevo] falha HTTP ${resp.status} ao adicionar ${email}:`, data);
      return { ok: false, status: resp.status, data };
    }
    console.log(`[Brevo] contato adicionado/atualizado na lista ${listId}: ${email} (status ${resp.status}).`);
    return { ok: true, status: resp.status, data };
  } catch (err) {
    console.error(`[Brevo] erro ao adicionar contato ${email}:`, err?.message || err);
    return { ok: false, erro: err?.message || String(err) };
  }
}

/**
 * Descadastra (blacklist) um contato no Brevo — usado quando o lead pede opt-out
 * por WhatsApp ("SAIR"). Best-effort: sem credencial/e-mail, apenas pula.
 * @param {string} email
 * @returns {Promise<{ok:boolean, status?:number, pulado?:boolean, erro?:string}>}
 */
export async function desinscrever(email) {
  const { BREVO_API_KEY } = process.env;
  if (!BREVO_API_KEY) {
    console.log('[Brevo] não configurado (BREVO_API_KEY ausente) — pulando desinscrição.');
    return { ok: true, pulado: true };
  }
  if (!email) {
    // Lead de WhatsApp normalmente não tem e-mail no nosso banco — não há o que refletir.
    return { ok: true, pulado: true, motivo: 'sem_email' };
  }

  try {
    const resp = await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
      method: 'PUT',
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({ emailBlacklisted: true, smsBlacklisted: true }),
      signal: AbortSignal.timeout(8000),
    });
    if (!resp.ok && resp.status !== 204) {
      const data = await resp.json().catch(() => ({}));
      console.error(`[Brevo] falha HTTP ${resp.status} ao desinscrever ${email}:`, data);
      return { ok: false, status: resp.status, data };
    }
    console.log(`[Brevo] contato desinscrito (blacklist): ${email} (status ${resp.status}).`);
    return { ok: true, status: resp.status };
  } catch (err) {
    console.error(`[Brevo] erro ao desinscrever contato ${email}:`, err?.message || err);
    return { ok: false, erro: err?.message || String(err) };
  }
}
