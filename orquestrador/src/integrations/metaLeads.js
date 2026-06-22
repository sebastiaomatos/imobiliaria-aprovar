// integrations/metaLeads.js — leitura de um lead do Meta Lead Ads via Graph API.
//
// O webhook só recebe o `leadgen_id`; os dados do formulário (nome, telefone,
// e-mail, campos customizados) são buscados aqui com o Page Access Token
// (permissão leads_retrieval). fetch nativo + timeout, padrão das demais
// integrations/.

/**
 * Busca os dados de um lead pelo leadgen_id.
 * @param {string} leadgenId
 * @returns {Promise<{ok:boolean, status?:number, data?:any, erro?:string}>}
 */
export async function buscarLead(leadgenId) {
  const token = process.env.META_PAGE_ACCESS_TOKEN;
  const version = process.env.META_GRAPH_VERSION || 'v21.0';

  // Defensivo: sem token não há como buscar (falha clara, sem vazar segredo).
  if (!token) {
    console.error('[Meta Leads] META_PAGE_ACCESS_TOKEN ausente — não consigo buscar o lead.');
    return { ok: false, erro: 'sem_token' };
  }
  if (!leadgenId) {
    console.error('[Meta Leads] leadgen_id ausente — nada a buscar.');
    return { ok: false, erro: 'sem_leadgen_id' };
  }

  // ATENÇÃO: a URL contém o access_token na query — NUNCA logar a URL.
  const url =
    `https://graph.facebook.com/${version}/${encodeURIComponent(leadgenId)}` +
    `?access_token=${encodeURIComponent(token)}`;

  try {
    const resp = await fetch(url, { signal: AbortSignal.timeout(8000) });
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      // Loga só status + código/tipo do erro do Graph (nunca a URL/token).
      const code = data?.error?.code ?? '?';
      const type = data?.error?.type ?? '?';
      const msg = data?.error?.message ?? '';
      console.error(
        `[Meta Leads] falha HTTP ${resp.status} ao buscar leadgen — Graph code ${code} (${type}). ${msg}`,
      );
      return { ok: false, status: resp.status, erro: msg || `graph_${code}`, data };
    }
    return { ok: true, status: resp.status, data };
  } catch (err) {
    // Loga só a mensagem (nunca a URL com token).
    console.error('[Meta Leads] erro ao buscar leadgen:', err?.message || err);
    return { ok: false, erro: err?.message || String(err) };
  }
}
