// integrations/brevo.js — e-mail marketing via Brevo.
//
// adicionarContato cria/atualiza o contato e o adiciona à lista BREVO_LIST_ID.
// É a ENTRADA NA LISTA que dispara a automação de e-mails configurada no Brevo.
// fetch nativo do Node.

/**
 * Converte um telefone brasileiro para E.164 ("+55DDDNUMERO"). Aceita número já com
 * DDI (55…) ou nacional (DDD + número) — neste caso prefixa o 55. Retorna `null`
 * quando não é um BR válido (12–13 dígitos com DDI): assim o atributo SMS apenas
 * deixa de ser enviado, sem derrubar a criação do contato.
 * @param {string|number} telefone
 * @returns {string|null}
 */
export function telefoneParaE164BR(telefone) {
  const d = String(telefone ?? '').replace(/\D/g, '');
  const comDDI = d.startsWith('55') ? d : (d.length === 10 || d.length === 11 ? '55' + d : d);
  // BR em E.164: 55 + DDD(2) + número(8 fixo | 9 móvel) = 12 ou 13 dígitos.
  if (!comDDI.startsWith('55') || comDDI.length < 12 || comDDI.length > 13) return null;
  return '+' + comDDI;
}

/**
 * Cria/atualiza um contato no Brevo e o adiciona a uma lista. Mapeia os atributos
 * REAIS do Brevo: FIRSTNAME (1ª palavra do nome), LASTNAME (o resto) e SMS (telefone
 * em E.164). Cada atributo só é enviado quando tem valor.
 * @param {string} email E-mail do lead.
 * @param {string} nome  Nome completo (FIRSTNAME = 1ª palavra; LASTNAME = o resto).
 * @param {string|number} [listId] ID da lista; default BREVO_LIST_ID (use
 *   BREVO_LIST_ID_VIP / BREVO_LIST_ID_VIP_B para os cadastros das landings).
 * @param {string|number} [telefone] Telefone do lead (formato BR livre) → atributo SMS.
 * @returns {Promise<{ok:boolean, status?:number, data?:any, pulado?:boolean, erro?:string}>}
 */
export async function adicionarContato(email, nome, listId = process.env.BREVO_LIST_ID, telefone = null) {
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

  // Atributos reais do Brevo. Só inclui o que tiver valor (no updateEnabled, mandar
  // vazio sobrescreveria um campo já preenchido do contato).
  const partesNome = String(nome ?? '').trim().split(/\s+/).filter(Boolean);
  const sms = telefoneParaE164BR(telefone);
  const attributes = {};
  if (partesNome.length) attributes.FIRSTNAME = partesNome[0];
  if (partesNome.length > 1) attributes.LASTNAME = partesNome.slice(1).join(' ');
  if (sms) attributes.SMS = sms;

  try {
    const resp = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        email,
        attributes,
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
