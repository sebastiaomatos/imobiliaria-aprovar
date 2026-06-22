// config.js — leitura e validação das variáveis de ambiente do orquestrador.
//
// Filosofia: NUNCA derrubar o processo por falta de variável. O servidor deve
// sempre subir (nem que seja só para o healthcheck) e apenas REGISTRAR avisos
// claros sobre o que falta. Assim o deploy no Railway não quebra por uma
// credencial ainda não configurada.

/**
 * Catálogo das variáveis esperadas.
 *   - name:     nome da variável de ambiente.
 *   - critical: se `true`, a ausência é um ALERTA (recurso essencial fica
 *               indisponível). Se `false`, é uma integração que ainda pode não
 *               estar configurada (normal nas fases iniciais).
 *   - desc:     descrição curta (vive só no código; nunca logamos valores).
 */
const SCHEMA = [
  { name: 'DATABASE_URL',          critical: true,  desc: 'PostgreSQL (injetada pelo Railway) — leads, agendamentos, eventos' },
  { name: 'WEBHOOK_SECRET',        critical: true,  desc: 'Valida o header x-webhook-secret em POST /webhook/lead' },

  { name: 'CORRETOR_WHATSAPP',     critical: false, desc: 'WhatsApp do corretor que recebe as notificações de lead' },
  { name: 'CADASTRO_ALLOWED_ORIGINS', critical: false, desc: 'Origens (CSV) liberadas no CORS do POST /cadastro; vazio = aberto' },
  { name: 'PRAEDIUM_WEBHOOK_IN_URL', critical: false, desc: 'URL do Webhook de Entrada do Praedium (envio de leads); vazio = pula' },
  { name: 'PRAEDIUM_API_KEY',      critical: false, desc: 'CRM Praedium (API, quando aplicável)' },
  { name: 'ZAPI_INSTANCE_ID',      critical: false, desc: 'Z-API: ID da instância de WhatsApp' },
  { name: 'ZAPI_INSTANCE_TOKEN',   critical: false, desc: 'Z-API: token da instância' },
  { name: 'ZAPI_CLIENT_TOKEN',     critical: false, desc: 'Z-API: Client-Token de segurança' },
  { name: 'BREVO_API_KEY',         critical: false, desc: 'Brevo: API key (e-mail/contatos)' },
  { name: 'BREVO_LIST_ID',         critical: false, desc: 'Brevo: ID da lista que dispara a automação de e-mails' },
  { name: 'BREVO_LIST_ID_VIP',     critical: false, desc: 'Brevo: ID da lista VIP (cadastro da landing /cadastro)' },
  { name: 'GEMINI_API_KEY',        critical: false, desc: 'Google Gemini: geração de laudo' },
  { name: 'META_CAPI_TOKEN',       critical: false, desc: 'Meta CAPI: token de eventos server-side' },
  { name: 'META_PIXEL_ID',         critical: false, desc: 'Meta: ID do Pixel/Dataset' },
  { name: 'META_GRAPH_VERSION',    critical: false, desc: 'Versão da Graph API (ex.: v21.0); default no código' },
  { name: 'META_AD_ACCOUNT_ID',    critical: false, desc: 'Meta: ID da conta de anúncios (act_...)' },
  { name: 'META_PAGE_ID',          critical: false, desc: 'Meta: ID da página (Botanique: 104610745886365)' },
  { name: 'META_BUSINESS_ID',      critical: false, desc: 'Meta: ID do Business Manager' },

  // Webhook do Meta Lead Ads (formulário nativo → /webhook/meta-lead).
  { name: 'META_APP_SECRET',         critical: false, desc: 'Meta: App Secret p/ validar X-Hub-Signature-256 (sem ele, POST do webhook → 403)' },
  { name: 'META_VERIFY_TOKEN',       critical: false, desc: 'Meta: token de verificação do handshake GET (string aleatória que você escolhe)' },
  { name: 'META_PAGE_ACCESS_TOKEN',  critical: false, desc: 'Meta: Page Access Token long-lived (permissão leads_retrieval) p/ buscar o lead' },
  { name: 'META_LEAD_FIELD_OBJETIVO', critical: false, desc: 'Key do campo "objetivo" no Instant Form (fallback: "objetivo")' },
  { name: 'META_LEAD_FIELD_OPTIN',   critical: false, desc: 'Key da pergunta de opt-in WhatsApp no Instant Form; sem valor afirmativo → optin=false (não envia M0)' },

  // M0 ativa proativa (outbound) ao lead com opt-in.
  { name: 'M0_ATIVA_ENABLED',        critical: false, desc: "Liga/desliga a M0 ativa proativa ('true'/'false'; default 'true')" },
];

/**
 * Lê as variáveis de `process.env`, valida presença e loga um resumo.
 * Não lança erro nem encerra o processo.
 *
 * @param {{ info: Function, warn: Function }} [log=console] Logger (use app.log).
 * @returns {Record<string, string|null>} Valores por nome (null se ausente).
 */
export function loadConfig(log = console) {
  /** @type {Record<string, string|null>} */
  const config = {};
  const ausentesCriticas = [];
  const ausentesOpcionais = [];

  for (const { name, critical } of SCHEMA) {
    const bruto = process.env[name];
    const valor = typeof bruto === 'string' && bruto.trim() !== '' ? bruto.trim() : null;
    config[name] = valor;
    if (valor === null) {
      (critical ? ausentesCriticas : ausentesOpcionais).push(name);
    }
  }

  // ---- Resumo no boot (sem expor valores) ----
  const total = SCHEMA.length;
  const definidas = total - ausentesCriticas.length - ausentesOpcionais.length;
  log.info(`Config: ${definidas}/${total} variáveis de ambiente definidas.`);

  if (ausentesCriticas.length > 0) {
    log.warn(
      `⚠️  Variáveis CRÍTICAS ausentes: ${ausentesCriticas.join(', ')}. ` +
      'O servidor sobe normalmente, mas recursos que dependem delas ficarão indisponíveis.',
    );
  }
  if (ausentesOpcionais.length > 0) {
    log.warn(
      `Integrações ainda sem credenciais (ok nesta fase): ${ausentesOpcionais.join(', ')}.`,
    );
  }
  if (ausentesCriticas.length === 0 && ausentesOpcionais.length === 0) {
    log.info('Todas as variáveis esperadas estão definidas. 👍');
  }

  return config;
}
