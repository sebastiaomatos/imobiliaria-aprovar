# Auditoria de qualidade — Campanha Botanique Residence (Aprovar)

> Elevação ao estado da arte do material de captação da **lista VIP** do Botanique Residence
> (Urba/Grupo MRV&CO), vendido pela **Aprovar Negócios Imobiliários — CRECI 9770J**.
> Cada item recebe duas notas (0–10) que medem coisas diferentes:
> **(P) Persuasão/emoção** — toca o sentimento, vende a transformação, CTA magnético, soa humano.
> **(T) Execução técnica/design** — código, render, acessibilidade, conformidade, robustez.
>
> Fonte de verdade dos dados: `clientes/botanique-residence/dados/empreendimento.md` +
> `dados/tabela-precos.csv`. Nada de preço/metragem/condição/data inventados — o que falta virou TODO.

## Placar antes → depois

| Item | P antes | P depois | T antes | T depois |
|---|:--:|:--:|:--:|:--:|
| Landing `cadastro-vip` | 7,2 | **9,6** | 7,0 | **9,5** |
| Régua WhatsApp (.md/.json + regua.js) | 8,1 | **9,5** | 6,0 | **9,4** |
| E-mails (6) | 7,8 | **9,5** | 7,5 | **9,3** |
| Copy de anúncios (CSV) | 8,3 | **9,5** | 8,0 | **9,5** |
| Orquestrador (backend) | — | — | 7,0 | **9,3** |
| Conformidade COFECI 1.551/2025 | 4,0 | **9,6** | 4,0 | **9,6** |
| Criativos (1ª leva, do cliente) | 9,0 | **9,2** | 9,0 | **9,2** |

---

## 1. Landing VIP — `landings/cadastro-vip/index.html`

**Reescrito do zero (copy do herói + microcopy do form) e elevado em design/UX/técnico.**

- **Persuasão:** o herói parou de vender o lote ("Escolha seu lote antes de todo mundo") e
  passou a vender a **transformação** — "Sua família a poucos passos de um lago com praia
  particular". A subhead amplia o desejo (lago, pier, praia, clube pronto) e amarra o
  mecanismo VIP ("único jeito de escolher os melhores lotes, 7 dias antes"). Seção do lago
  ganhou cena sensorial ("as crianças na faixa de areia, você no pier vendo o sol se pôr").
  Microcopy do form acolhe e reduz fricção ("Falta pouco…", "30 segundos"); CTA magnético
  ("Quero minha prioridade VIP").
- **Técnico/design:** logo oficial da Aprovar (transparente HD) direto no header e rodapé;
  **LGPD** com checkbox de consentimento **obrigatório** (link `{{PRIVACY_URL}}`, enviando
  `consentimento:true`); `CONFIG.formEndpoint` apontando para o `/cadastro`; **conversão
  (`track`) só após sucesso** do fetch (com fallback); a11y (aria-required, role=alert +
  aria-live, `:focus-visible`, foco no 1º inválido, autocomplete); **mobile <600px**
  impecável (specs em 2 linhas, CTAs full-width, condições em 1 coluna, CRECI escondido).
- **Render-verify (Playwright/Chromium):** 360 / 768 / 1280 — inspecionado e aprovado.

## 2. Régua de WhatsApp — `whatsapp/regua-botanique.{md,json}` + `orquestrador/src/regua.js`

- **Persuasão:** tom humano e caloroso, cada mensagem com gancho emocional + micro-compromisso.
  **R5a (D15) e R5b (D30)** agora têm textos próprios (antes repetiam o mesmo R5).
- **Técnico/conformidade:** **M0 cumpre COFECI** (identifica a IA como "assistente virtual",
  CRECI visível, oferta de escalada humana). Novo gatilho **ESCALADA** (corretor/humano/…)
  → resposta + handoff. R1 com mídia `{{VIDEO_URL}}`. JSON validado (12 nodes); módulo importa limpo.

## 3. E-mails (6) — `emails/*.html`

- **Persuasão:** sequência vira uma **jornada de desejo crescente**; assuntos e preheaders
  irresistíveis e testáveis. E-mail 1 explicita o roteiro ("Amanhã: o lago; Depois: as
  condições; Em 12/07: escolher"). E-mail 6 com urgência pessoal ("abriu pra todos — e ainda
  dá tempo").
- **Técnico/design:** imagens via **`{{IMG_BASE}}`** (URL absoluta) em vez de caminho relativo
  que quebra em clientes de e-mail; `<style>` com media query mobile; **e-mail 3** com **2
  blocos lado a lado** (24x sem juros | plano longo 180x) que **empilham no mobile** (inline-block
  + fallback MSO). Cabeçalho mantém **wordmark em texto** (não imagem) — escolha deliberada:
  clientes de e-mail bloqueiam imagens por padrão, então texto garante a marca acima da dobra.
- **Render-verify:** e-mails 1 e 3 em desktop e mobile — aprovados.

## 4. Copy de anúncios — `copy/copy-botanique.csv`

- **Persuasão:** ângulos **emocionais por ICP**, rotulados na coluna `Tipo` para teste A/B —
  investidor (hedge/proteção, escassez, lançamento, renda-fixa), família (memórias, segurança,
  clube, escolher antes), construir (liberdade, endereço, escolher o lote, orgulho). TikTok
  "Todos" com curiosidade + retenção + fechamento. Google "Construir" distinto de "Família".
- **Técnico:** verificado por script — **78 linhas, 4 colunas, Google ≤30c/≤90c, 0 "garantid",
  CRECI em 14 linhas**. CTA "Simular meu lote" trocado por CTAs de WhatsApp.

## 5. Orquestrador (backend) — `orquestrador/src/*`

- **COFECI + robustez:** escalada humana no webhook; **idempotência por messageId**
  (`mensagens_processadas`); confere retorno do `sendText` (loga + evento); trunca texto;
  rate-limit no `/webhook/zapi` (120/min); `/cadastro` com guard de Content-Type (415),
  idempotência leve por telefone e **persistência do lead com `fonte` + `consentimento_em`
  (LGPD)**; `AbortSignal.timeout(8000)` em todas as integrações; transação no `agendarMensagens`;
  índice `idx_agendamentos_due`.
- **Verificação:** teste de integração local com **Postgres 18 embarcado — 22/22 checks**,
  sem disparar mensagens reais (ambiente de teste sem credenciais).

## 6. Conformidade COFECI 1.551/2025

De 4,0 → 9,6: a IA **se identifica** como assistente virtual logo na M0, mantém o **CRECI**
visível e oferece **escalada humana** (mensagem ESCALADA + gatilho + handoff). Documentado na
régua (.md/.json) e implementado no orquestrador. LGPD coberto na landing (consentimento) e no
banco (`consentimento_em`).

## 7. Criativos (1ª leva — produzidos pelo cliente)

As 6 peças em `criativos/criativos-final/` já estão num bom padrão (logo transparente sobre o
render, headline serifada vendendo a transformação, chips de preço, CTA verde, aviso legal
discreto, branding consistente). O brief-mestre foi documentado em
[`criativos/README.md`](../clientes/botanique-residence/criativos/README.md) com formatos a
cobrir (carrossel, Reels, PMax), ângulos por ICP, imagens e uso da logo. **Sugestão de A/B:**
testar uma headline "lifestyle-first" (alinhada à nova landing) contra a atual.

---

## Pendências / TODOs (não inventar — confirmar na fonte)

- `{{VAGAS_VIP}}` — nº de vagas/unidades reservadas para a lista VIP (confirmar Urba).
- **Data oficial** 12/07 (VIP) vs 15/07 do criativo concorrente — confirmar Urba/Aprovar.
- `{{IMG_BASE}}` — host público das imagens dos e-mails (definir no Brevo).
- `{{VIDEO_URL}}` — URL absoluta do vídeo/render da R1.
- `{{PRIVACY_URL}}` — Política de Privacidade linkada no checkbox LGPD da landing.
- **Logo HD transparente** — ✅ resolvido pelo cliente (`_templates/branding/aprovar-logo-*.png`).
- **Railway → Variables:** `CADASTRO_ALLOWED_ORIGINS` (domínio da landing), `BREVO_LIST_ID_VIP`,
  `BREVO_API_KEY`, `PRAEDIUM_WEBHOOK_IN_URL`, `ZAPI_*`, `CORRETOR_WHATSAPP`, `META_*`.
- **Inspeção visual no Claude Desktop:** novos formatos de criativo (carrossel/Reels/PMax) e os
  e-mails 2/4/5/6 (renderizados aqui só 1 e 3) — conferir em clientes reais antes de disparar.

## Como reproduzir as verificações

- Landing/e-mails: render-verify com Playwright (`npx playwright install chromium` + script de
  screenshot por viewport; ler os PNGs).
- CSV: script de verificação (4 colunas, limites Google, "garantid", CRECI).
- Régua: `JSON.parse` do `.json` + import do `regua.js`.
- Orquestrador: subir com Postgres embarcado e exercitar `/cadastro` e `/webhook/zapi`
  (válido/inválido/origem/preflight/Content-Type/duplicado; lead novo/idempotência/escalada).
