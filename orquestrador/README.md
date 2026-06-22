# Orquestrador (Node / Fastify)

Automação que conecta landing → Praedium → Z-API (WhatsApp) → Gemini (laudo) → Brevo (e-mail) → Meta CAPI, para o sistema Imóveis AQV.

## Rodar localmente

```bash
cd orquestrador
npm install
cp .env.example .env   # preencha os valores (o servidor também lê o .env da raiz como fallback)
npm run dev            # com --watch; ou: npm start
```

O servidor sobe em `http://localhost:3000` (ou na porta de `$PORT`).

## Rotas

- `GET /` — healthcheck: `{ status: "ok", service: "orquestrador-aqv", ts }`.
- `POST /webhook/lead` — recebe leads. Exige o header `x-webhook-secret` igual ao `WEBHOOK_SECRET`; caso contrário responde **401**. Por ora apenas loga o corpo recebido (o fluxo completo entra no 0.7).
- `POST /cadastro` — cadastro da landing (lista VIP). Público (CORS + rate-limit + validação). Processa o lead pelo serviço único [`processarLead`](src/services/processarLead.js): persiste no banco, cria no Praedium, adiciona à lista VIP do Brevo, dispara a **M0 ativa** (se opt-in) e **notifica o corretor**. Na landing, o consentimento LGPD funciona como opt-in de WhatsApp.
- `GET /webhook/meta-lead` — handshake de verificação do Meta. Com `hub.mode=subscribe` e `hub.verify_token` igual ao `META_VERIFY_TOKEN`, ecoa o `hub.challenge` (texto puro). Caso contrário, **403**.
- `POST /webhook/meta-lead` — recebe leads do **Meta Lead Ads** (formulário nativo). Roteia pelo MESMO `processarLead` do `/cadastro`, com `fonte=meta_form`. Ver a seção abaixo.

## Webhook do Meta Lead Ads (`/webhook/meta-lead`)

Recebe o lead do formulário nativo em tempo real (para o atendimento &lt;5 min) e o roteia pelo mesmo fluxo do `/cadastro`.

**Como funciona (resumo técnico):**
1. **Segurança primeiro** — o `POST` valida o header `X-Hub-Signature-256` (HMAC-SHA256 com `META_APP_SECRET`) sobre o **corpo cru** (bytes), comparando em tempo constante. Assinatura inválida → **403**, sem processar. O corpo cru é retido por um content-type parser **encapsulado só nesta rota** (o `/cadastro` e o `/webhook/zapi` seguem com o parser JSON seguro padrão do Fastify).
2. **Idempotência** por `leadgen_id` (reusa a tabela `mensagens_processadas` com prefixo `metalead:`). Já processado → **200** e sai.
3. **Busca o lead no Graph API** (`GET /{leadgen_id}` com o `META_PAGE_ACCESS_TOKEN`, timeout 8 s). Token expirado/erro → log claro (sem vazar o token) e **500** para o Meta reenviar.
4. **Mapeia o `field_data`** → nome (`full_name` ou `first_name`+`last_name`), `phone_number` (normalizado para `55DDDNUMERO`), `email`, o campo **objetivo** (chave de `META_LEAD_FIELD_OBJETIVO`, com fallback) e o **opt-in de WhatsApp** (chave de `META_LEAD_FIELD_OPTIN`; sem valor afirmativo → opt-in `false`). `consentimento_em = created_time` (o envio do Instant Form, que exige link de política, é o aceite LGPD).
5. **Persiste e responde 200** após gravar; se a persistência inicial falhar (DB fora) → **500** para o Meta reenviar. O **downstream** (Praedium → Brevo → M0 ativa → corretor) roda em **background** para a resposta ao Meta ser rápida.

### Configuração (ações de painel/API — Sebastião)

1. **Page Access Token long-lived** com permissão `leads_retrieval` (crie um *System User* no Business Manager, gere o token e cole em `META_PAGE_ACCESS_TOKEN`).
2. **App Dashboard → Webhooks → Page**: callback URL `https://imobiliaria-aprovar-production.up.railway.app/webhook/meta-lead`, *Verify Token* = `META_VERIFY_TOKEN`, e **assine o campo `leadgen`**.
3. **Assine a página no app**: `POST /{META_PAGE_ID}/subscribed_apps?subscribed_fields=leadgen` (com o page token). `META_PAGE_ID` do Botanique = `104610745886365`.
4. **`META_GRAPH_VERSION`**: confira a versão **vigente** da Graph API no [changelog](https://developers.facebook.com/docs/graph-api/changelog) e use a atual (o default no código é `v21.0`).
5. **Instant Form (Campanha A)**: crie com a pergunta **"objetivo"** (morar/investir/construir) e a pergunta de **opt-in de WhatsApp** (consentimento). Pegue as *keys* dos dois campos e ponha em `META_LEAD_FIELD_OBJETIVO` e `META_LEAD_FIELD_OPTIN`. ⚠️ Enquanto não confirmadas: `objetivo` tem fallback; o **opt-in sem campo confirmado fica `false`** (não dispara M0 ativa — escolha LGPD-segura). **Confirmar as keys ao montar o formulário.**

### Teste real (Lead Ads Testing Tool)

Use a [Lead Ads Testing Tool](https://developers.facebook.com/tools/lead-ads-testing): envie um lead de teste → confirme **200** no webhook (logs do Railway) → o lead deve aparecer no Praedium, o contato na lista VIP do Brevo, o registro no banco com `fonte=meta_form`, a **M0 ativa enviada** (se opt-in) e o **corretor notificado**.

## M0 ativa, notificação ao corretor e opt-out

Fluxo disparado por `processarLead` (site `/cadastro` e Meta), **após** Praedium + Brevo:

- **M0 ativa (proativa):** primeira mensagem no WhatsApp ao lead — só com **opt-in** (`whatsapp_optin === true`) **e** `M0_ATIVA_ENABLED !== 'false'`. Idempotente (`leads.m0_ativa_enviada`): nunca reenvia. **Coordena com a régua inbound** — se o lead já iniciou conversa (inbound já marcou `m0_ativa_enviada=true`, ou está `em_atendimento`), **não** envia a ativa (evita mensagem dupla). Nunca envia a quem tem `whatsapp_optout_em`. Texto em [`regua.js`](src/regua.js) (`MENSAGENS.M0_ATIVA`) — cumpre COFECI (IA se identifica, CRECI, oferece corretor) e LGPD (opt-out por "SAIR").
- **Notificação ao corretor (sempre):** todo lead novo de site/Meta gera um aviso a `CORRETOR_WHATSAPP` com link `wa.me/{telefone}`. Idempotente (`leads.corretor_notificado`), independe de opt-in.
- **Opt-out (no `/webhook/zapi`):** inbound com **SAIR/PARAR/CANCELAR** → grava `whatsapp_optout_em`, **para a régua**, responde a confirmação, **reflete o descadastro no Brevo** (best-effort, se houver e-mail do lead) e **bloqueia** envios futuros (régua/M0).

## Testes

```bash
cd orquestrador
npm test     # node --test — sem banco/rede (dependências injetadas)
```

Cobrem: assinatura sobre o corpo cru, mapeamento do `field_data` (incl. opt-in), idempotência por `leadgen_id`, persist→200 / falha→500, regressão do `/cadastro`, gating + idempotência da **M0 ativa**, notificação ao corretor, **opt-out** e a coordenação com a régua inbound. **30 testes.**

## Variáveis de ambiente

Ver `.env.example`. Segredos **nunca** são versionados (`.env` é ignorado pelo git). Em produção, defina-as na aba **Variables** do Railway. A validação no boot avisa o que estiver faltando, mas **não derruba** o servidor.

## Deploy no Railway

- **Root Directory** = `orquestrador` (Settings › Service › Source).
- **Start Command** = `npm start` (Node é detectado automaticamente).
- O servidor escuta em `0.0.0.0` e na porta `process.env.PORT` (injetada pelo Railway).
- Gere um domínio em Settings › Networking e teste o `GET /`.
