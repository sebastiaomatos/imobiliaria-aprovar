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
  { name: 'WEBHOOK_SECRET',      critical: true,  desc: 'Valida o header x-webhook-secret em POST /webhook/lead' },

  { name: 'PRAEDIUM_API_KEY',    critical: false, desc: 'CRM Praedium (leads e estágios do funil)' },
  { name: 'ZAPI_INSTANCE_ID',    critical: false, desc: 'Z-API: ID da instância de WhatsApp' },
  { name: 'ZAPI_INSTANCE_TOKEN', critical: false, desc: 'Z-API: token da instância' },
  { name: 'ZAPI_CLIENT_TOKEN',   critical: false, desc: 'Z-API: Client-Token de segurança' },
  { name: 'BREVO_API_KEY',       critical: false, desc: 'Brevo: e-mail transacional' },
  { name: 'GEMINI_API_KEY',      critical: false, desc: 'Google Gemini: geração de laudo' },
  { name: 'META_CAPI_TOKEN',     critical: false, desc: 'Meta CAPI: token de eventos server-side' },
  { name: 'META_PIXEL_ID',       critical: false, desc: 'Meta: ID do Pixel/Dataset' },
  { name: 'META_AD_ACCOUNT_ID',  critical: false, desc: 'Meta: ID da conta de anúncios (act_...)' },
  { name: 'META_PAGE_ID',        critical: false, desc: 'Meta: ID da página' },
  { name: 'META_BUSINESS_ID',    critical: false, desc: 'Meta: ID do Business Manager' },
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
