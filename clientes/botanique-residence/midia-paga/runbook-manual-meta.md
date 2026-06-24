# Runbook manual — Meta Ads + Google Ads — Botanique VIP (Aprovar)

> Tudo em **rascunho/PAUSADO**. Estratégia segue o `config-campanhas.md` (correção oficial: **poucos conjuntos amplos, diferenciar por criativo/copy** — não fragmentar). Conformidade: "a partir de", "sujeito a alteração", **CRECI 9770J**, sem promessa de valorização (só hedge factual), imagens ilustrativas.
> Fontes auditadas no repo: `anuncios-copy.md`, `plano-de-midia-botanique.md`, `config-campanhas.md`.
> Salvar em: `clientes/botanique-residence/midia-paga/runbook-manual-meta.md`

## 0. Convenções

### 0.1 Nomenclatura padronizada (minúsculas, sem acento, hífens -> segura pra UTM)
> Regra de ouro: o **nome do anúncio = valor do `utm_content`** (via macro). Por isso nada de espaço/acento nos nomes.

| Nível | Nome padrão |
|---|---|
| Campanha A | `meta-bot-leads-cadastro-vip` |
| - Conjunto Formulário | `meta-bot-leads-formulario` |
| - Conjunto Site | `meta-bot-leads-site` |
| Campanha B | `meta-bot-msg-conversas` |
| - Conjunto | `meta-bot-msg-amplo` |
| Campanha C | `meta-bot-leads-retargeting` |
| - Conjunto | `meta-bot-leads-rtg-site30d` |
| Anúncios | `ad-<angulo>-<criativo>-<formato>` -> ex.: `ad-familia-c3-story`, `ad-investidor-c5-feed`, `ad-amplo-carrossel` |
| Google Search | `gads-bot-search` - grupos `ag-marca`, `ag-lote`, `ag-lago` |
| Google PMax | `gads-bot-pmax` - grupo de recursos `rg-botanique` |

### 0.2 UTM (boas práticas: tag fixa por campanha + macros dinâmicos)
> **Onde colar** — Meta: nível **Anúncio -> Rastreamento -> "Parâmetros de URL do site"** (cole sem o `?`). Google: **Campanha -> Configurações -> Opções de URL da campanha -> "Sufixo do URL final"** (sem `?`). Mantenha o **auto-tagging (gclid) do Google ligado** — UTM é p/ a landing gravar `fonte`; gclid é p/ o GA4.

| Campanha | String de UTM | Observação |
|---|---|---|
| **A — Site** | `utm_source=meta&utm_medium=paid_social&utm_campaign=botanique-cadastro-vip&utm_content={{ad.name}}&utm_term={{adset.name}}` | macros preenchem sozinhas |
| **A — Formulário** | (sem URL) | atribuição via `fonte=meta_form` (webhook) |
| **B — Conversas** | (sem URL) | atribuição via referral do CTWA |
| **C — Retargeting** | `utm_source=meta&utm_medium=paid_social&utm_campaign=botanique-retargeting&utm_content={{ad.name}}&utm_term={{adset.name}}` | |
| **Google — Search** | `utm_source=google&utm_medium=cpc&utm_campaign=botanique-search&utm_content={creative}&utm_term={keyword}` | ValueTrack `{keyword}`/`{creative}` |
| **Google — PMax** | `utm_source=google&utm_medium=pmax&utm_campaign=botanique-pmax&utm_content={campaignid}` | PMax não suporta `{keyword}` |

### 0.3 Pré-requisitos (fazer antes)
- Aceitar **Lead Ads ToS** (https://www.facebook.com/legal/leadgen/tos) e **Públicos Personalizados ToS** (https://www.facebook.com/customaudiences/app/tos/?act=1155564008436004).
- **Pixel `1708075710023708`** disparando `Lead` no cadastro (Gerenciador de Eventos -> Testar eventos).
- **Decisão CAPI:** plugar `metaCapi.js` (Claude Code) **ou** começar o conjunto Site otimizando por **Visualizações da página de destino** e migrar pra `Lead` com volume.
- **Geo padrão (todas):** `Cuiabá, MT` + `Várzea Grande, MT` + raio **30 km** - "pessoas que moram aqui".
- **Google:** importar a conversão **`lead_submit`** do GA4 (`G-GXQZBRTHHW`) em Ferramentas -> Conversões.

---

## 1. META — Campanha A - `meta-bot-leads-cadastro-vip` (Leads, ABO, Habitação/BR)

**Conjunto `meta-bot-leads-formulario` - R$ 20/dia** (conclui após Lead Ads ToS; entrega de leads depende da BM)
- Local de conversão **Formulários instantâneos** - tipo **Maior intenção** (tela de revisão) - Meta **Maximizar leads**.
- Formulário `968212722880024`: nome, telefone, e-mail **+ qualificadora "Seu objetivo? Morar / Investir / Construir"** + **consentimento LGPD + link** https://imobiliaria-aprovar.netlify.app/privacidade.html
- Público AMPLO (geo padrão; 28-60 sugestão; PT; **Advantage+**) - Posicionamentos **Advantage+** - Lance **maior volume** -> depois **limite de custo** no CPL alvo.

**Conjunto `meta-bot-leads-site` - R$ 15/dia**
- Local de conversão **Site** - Pixel `1708075710023708` - evento `Lead` (ou LPV no início — ver 0.3) - Meta **Maximizar conversões** - mesmo público/posicionamentos.
- URL https://imobiliaria-aprovar.netlify.app/ + UTM da tabela 0.2 (A-Site).

**Anúncios (crie os mesmos nos 2 conjuntos; copie os textos abaixo):**

### `ad-familia-c3-story` / `ad-familia-c1-feed` / `ad-familia-c4-feed` (c3 lago, c1 VIP, c4 oferta — 9:16 e 1:1)
- Texto 1: Imagina o fim de tarde: as crianças na faixa de areia, o pôr do sol no pier e a sua casa a poucos passos do lago. O Botanique Residence — condomínio fechado com lago, praia particular e um clube pronto (piscina com pool bar, quadras e pista de cooper de 1,4 km) — está chegando a Cuiabá. Lotes a partir de R$ 312.500, entrada de 10% e 24x sem juros. Entre na lista VIP e escolha seu lote antes da abertura geral.
- Texto 2: Um lugar para a sua família viver perto da natureza, com segurança de condomínio fechado: lago com praia, piscina, pista de cooper, playground e pet place. Botanique Residence, em Cuiabá — lotes a partir de R$ 312.500. A lista VIP escolhe primeiro. Cadastre-se.
- Títulos: `Lotes à beira de um lago em Cuiabá` / `Sua casa a poucos passos do lago` — Descrição: `Lista VIP aberta - CRECI 9770J`

### `ad-investidor-c5-feed` / `ad-investidor-c1-story` (c5 patrimônio, c1 VIP)
- Texto 1: Dinheiro parado perde valor. Terra em região nobre de Cuiabá continua sendo terra. O Botanique Residence — condomínio fechado com lago, pier e estrutura de clube (piscina, quadras, academia) — abre lotes a partir de R$ 312.500, entrada de 10% e 24x sem juros. Garanta a melhor posição entrando na lista VIP antes da abertura geral.
- Texto 2: Ativo real, no seu nome, em um dos endereços mais bem pensados de Cuiabá. Lotes de 250 a 347 m² no Botanique Residence, a partir de R$ 312.500, entrada de 10%. A lista VIP escolhe os melhores lotes primeiro.
- Texto 3: O Coxipó é uma das regiões que mais crescem em Cuiabá — perto da UFMT, do Shopping 3 Américas e de uma malha de comércio em expansão. Um lote em condomínio fechado aqui é patrimônio real, com potencial de valorização. Botanique Residence: lotes a partir de R$ 312.500, entrada de 10%. A lista VIP escolhe os melhores primeiro.
- Títulos: `Seu patrimônio em terra, em Cuiabá` / `Lotes a partir de R$ 312.500` / `Coxipó: região em expansão` — Descrição: `Lista VIP - escolha primeiro`

### `ad-construir-c6-story` / `ad-construir-c4-feed` (c6 construir, c4 oferta)
- Texto 1: O terreno é seu. A casa, do seu jeito. No Botanique Residence — condomínio fechado com lago, praia e clube de lazer (piscina, quadras, academia, espaço gourmet) — você escolhe um lote de 250 a 347 m² para construir o lar dos seus sonhos. A partir de R$ 312.500, entrada de 10%, 24x sem juros. Lista VIP aberta: escolha o seu antes da abertura geral.
- Títulos: `Seu lote para construir em Cuiabá` / `O terreno é seu. A casa, dos sonhos` — Descrição: `250-347 m² - entrada de 10%`

### `ad-amplo-c2-feed` / `ad-amplo-c3-story` / `ad-amplo-carrossel` (c2 VIP feed, c3, carrossel)
- Texto 1: Um condomínio fechado com lago, praia particular e estrutura de resort — 31 itens de lazer, do pier à pista de cooper de 1,4 km — chegou a Cuiabá. Botanique Residence: lotes a partir de R$ 312.500, entrada de 10% e 24x sem juros. Entre na lista VIP e escolha seu lote antes da abertura geral.
- Texto 2: Lago com praia, pier, piscina, pista de cooper de 1,4 km e um clube entregue pronto. Tudo dentro de um condomínio fechado em Cuiabá. Lotes a partir de R$ 312.500. Cadastre-se na lista VIP.
- Títulos: `Lago, praia e lazer em Cuiabá` / `Condomínio fechado com lago` — Descrição: `Lista VIP aberta - CRECI 9770J`

- **No Site:** CTA `Cadastre-se` + URL + UTM. **No Formulário:** CTA `Cadastre-se` + selecionar o form (sem URL).
- **SOTA:** em cada anúncio use **Advantage+ Creative / "Personalizar por posicionamento"** e suba **9:16 + 1:1 (ou 4:5)** — não um formato só.
- **Decisão (repo):** julgar por **custo-por-lead QUALIFICADO** (responde no WhatsApp/agenda), não CPL puro; após 5-7 dias migrar verba pro vencedor.

---

## 2. META — Campanha B - `meta-bot-msg-conversas` (Engajamento, R$ 15) — trava sem WhatsApp na BM
- Engajamento -> **Mensagens -> WhatsApp** `(65) 99232-6461` - otimizar **conversas iniciadas** - conjunto único `meta-bot-msg-amplo` (geo/idade da A) - Advantage+ - Lance maior volume.

### `ad-msg-c1-story` / `ad-msg-c3-story` (c1, c3 + vídeo `naturalmente` 9:16) - CTA Enviar mensagem
- Texto 1: Quer conhecer o Botanique Residence antes de todo mundo? Chama no WhatsApp - a gente te manda o mapa dos lotes, as condições de lançamento (entrada de 10%, 24x sem juros) e tira suas dúvidas na hora. Lotes a partir de R$ 312.500.
- Texto 2: Lago com pier, praia particular, piscina, quadras e pista de cooper de 1,4 km — tudo em condomínio fechado em Cuiabá. Me chama no WhatsApp que eu te mostro os lotes disponíveis e monto a condição que cabe no seu plano.
- Título: `Fale com a Aprovar no WhatsApp`
- Saudação automática: Oi! Que bom seu interesse no Botanique. Me diz seu nome e seu objetivo (morar, investir ou construir) que eu já te mando o mapa de lotes e as condições.

---

## 3. META — Campanha C - `meta-bot-leads-retargeting` (Leads, R$ 8) — Públicos ToS + Pixel coletando + restrição de Habitação
- Conjunto único `meta-bot-leads-rtg-site30d`, **combinar**: Visitantes Landing **30d EXCLUINDO `lead_submit`** + Engajou IG/FB **365d** + Vídeo **25%+ 365d** - Advantage+ - Site/Pixel `Lead` - UTM C-Retargeting.
- ATENÇÃO: **Habitação pode bloquear públicos personalizados/Lookalike** — confirme na criação; se travar, o RTG fica só no permitido.

### `ad-rtg-c4-feed` / `ad-rtg-c1-story` (c4 oferta, c1 VIP + vídeos `maquete`/`filmagem`)
- Texto 1: Você viu o Botanique e o lago ficou na cabeça, né? A lista VIP ainda está aberta — e quem entra agora escolhe os melhores lotes (perto do lago e do lazer) antes da abertura geral. Lotes a partir de R$ 312.500, entrada de 10%. Garanta o seu.
- Texto 2: Os melhores lotes do Botanique — os de frente pro lago — saem primeiro. Ainda dá tempo de entrar na lista VIP e escolher antes da abertura geral.
- Títulos: `Ainda dá tempo de entrar na VIP` / `Os melhores lotes saem primeiro` — Descrição: `Escolha antes da abertura geral`

---

## 4. Públicos exatos (Meta — reaproveitáveis)
- **Geo padrão:** Cuiabá + Várzea Grande + 30 km - "moram aqui".
- **Visitantes Landing 30d (sem cadastro):** fonte Pixel, 30d, **excluir** `lead_submit`.
- **Converteram `lead_submit` 180d** (exclusão).
- **Engajou IG/FB 365d** - **Vídeo 25%+ 365d** - **Lista VIP (e-mail, upload do Brevo)** — também semente de **Lookalike 1%** (criar quando houver ~100+ `lead_submit`).
- **Posicionamentos:** Advantage+ em todas (com verba pequena, é o que entrega melhor).

---

## 5. GOOGLE — Campanha 1 - `gads-bot-search` (Pesquisa)
- Tipo **Pesquisa** - Meta **Leads** - **Rede: só Pesquisa** (DESMARCAR Display e parceiros).
- **Orçamento R$ 15/dia** - Lances **Maximizar cliques** (semana 1) -> **Maximizar conversões** quando `lead_submit` tiver volume.
- **Locais:** Cuiabá + região - alvo **"presença — pessoas que moram/estão regularmente"** - Idioma Português.
- **Públicos:** adicionar **em Observação** (não restringir): "no mercado — imóveis".
- **Sufixo do URL final** (0.2 Google-Search) - **Caminho de exibição (display):** `/lista-vip` (cosmético; URL final = landing raiz).
- **Negativas:** aluguel, alugar, emprego, vaga, apartamento, usado, mobiliado, planta baixa grátis.

**Grupos + palavras (correspondência de frase):**
- `ag-marca`: "botanique residence", "botanique cuiabá", "botanique urba".
- `ag-lote`: "lote condomínio fechado cuiabá", "terreno cuiabá", "loteamento fechado cuiabá", "comprar lote cuiabá".
- `ag-lago`: "condomínio com lago cuiabá", "condomínio clube cuiabá".

**RSA (15 títulos / 4 descrições — cole):**
Títulos: `Botanique Residence Cuiabá` / `Lotes em Condomínio Fechado` / `Lago e Praia Particular` / `Lotes a partir de R$312.500` / `Entrada de 10% - 24x s/ Juros` / `Clube de Lazer Completo` / `Lista VIP — Escolha Antes` / `Terrenos de 250 a 347 m²` / `Condomínio com Lago em Cuiabá` / `Lotes para Construir em Cuiabá` / `Pré-lançamento Botanique` / `Pista de Cooper e Piscina` / `Cadastre-se na Lista VIP` / `Aprovar - CRECI 9770J` / `Fale no WhatsApp Agora`
Descrições: `Condomínio fechado com lago, praia e clube de lazer em Cuiabá. Lista VIP aberta.` / `Lotes a partir de R$ 312.500, entrada de 10% e 24x sem juros. Sujeito a disponibilidade.` / `Escolha seu lote antes da abertura geral. Cadastre-se na lista VIP.` / `Aprovar Negócios Imobiliários - CRECI 9770J - Atendimento no WhatsApp.`

**Extensões (recursos):**
- Sitelinks: `Lista VIP` / `Condições de lançamento` / `Lazer e estrutura` / `Falar no WhatsApp`
- Frases de destaque: `Lago e praia particular` / `Clube de lazer completo` / `Entrada de 10%` / `24x sem juros` / `Condomínio fechado`
- Snippet estruturado (Comodidades): Lago / Praia / Piscina / Pista de cooper / Quadras / Pet place

---

## 6. GOOGLE — Campanha 2 - `gads-bot-pmax` (Performance Max) — R$ 0 na Fase 0; liga na Fase 1 (R$ 10) / Fase 2 (R$ 15)
- Meta de conversão **`lead_submit`** - Sufixo do URL final (0.2 PMax).
- **Grupo de recursos `rg-botanique`:** assets PMax **1200x628, 1200x1200, 960x1200** + **logos 1:1 e 4:1** (`_templates/branding/pmax/`) + títulos/descrições abaixo.
- **Sinais de público:** segmento personalizado "lote / condomínio fechado Cuiabá" + dados do site.
- **Textos (cole):**
  - Títulos (30): `Lotes com Lago em Cuiabá` / `Botanique Residence` / `Lista VIP Aberta` / `Entrada de 10%` / `Clube de Lazer Completo`
  - Títulos longos (90): `Condomínio fechado com lago e praia particular em Cuiabá — lotes a partir de R$ 312.500` / `Entre na lista VIP do Botanique e escolha seu lote antes da abertura geral`
  - Descrições (90): `Lotes de 250 a 347 m², entrada de 10% e 24x sem juros. Sujeito a disponibilidade.` / `Lago, pier, praia, piscina e pista de cooper. Cadastre-se na lista VIP. CRECI 9770J.` / (curta 60) `Condomínio fechado com lago em Cuiabá. Lista VIP.`
  - Nome da empresa: `Aprovar Imobiliária`

*(Opcional — Demand Gen `gads-bot-demandgen` no YouTube/Discover/Gmail quando os Reels estiverem prontos.)*

---

## 7. Mapa criativo -> posicionamento (proporção)
| Criativo | Formato | Posicionamento |
|---|---|---|
| c1, c3, c6 (story) | 9:16 | Reels/Stories |
| c2, c4, c5 (feed) | 1:1 | Feed |
| carrossel | 4:5 | Feed/Explorar |
| vídeo `naturalmente` (hook lago) | 16:9 -> reenquadrar 9:16 | Feed/Reels - A e B |
| vídeo `maquete` (showcase) | 9:16 — cortar 15-20s + comprimir | Reels - engajados (A) e RTG (C) |
| vídeo `filmagem` (prova) | 9:16 | RTG (C) - PENDENTE: corrigir céu magenta |

---

## 8. Reality-check de performance (SOTA, honesto)
- **Fase de aprendizado é o gargalo:** ~R$58/dia no Meta + CPL de ticket alto (R$20-40) -> nenhum conjunto chega a ~50 conv/sem. Mitigação: **Formulário = motor de volume**; **Site otimiza por LPV no início**; RTG/CTWA gastam pouco até encher/destravar.
- **CAPI ausente** degrada a otimização por `Lead` (só client-side) -> decidir 0.3.
- **Hoje só a A-Site roda de fato** — Formulário (ToS+BM), B (BM) e C (ToS+Pixel) estão travados.
- **Refresh criativo** quando a frequência passar de ~2,5.

## 9. Ordem de montagem + status de bloqueios
1. Apagar as 3 drafts da API (sem categoria) -> recriar manualmente **com Habitação**.
2. Aceitar os 2 ToS - conferir Pixel/`Lead` - importar `lead_submit` no Google.
3. Meta: A (form+site) -> B -> C, **tudo pausado**. Google: Search -> PMax (R$0), **tudo pausado**.
4. Conferir orçamentos (A 35 - B 15 - C 8 - Search 15 - PMax 0), públicos, UTM (0.2), categoria especial.
5. **Play** só após: landing publicada/testada + (idealmente) CAPI + webhook Praedium OK + data 15/07 confirmada.

| Bloqueio | Destrava com |
|---|---|
| A-Formulário | Lead Ads ToS + Lead Access da BM |
| B-Conversas | número WhatsApp vinculado à BM |
| C-Retargeting | Públicos ToS + Pixel coletando + checar restrição Habitação |
| A-Site | OK pode rodar (falta só o anúncio com criativo) |

---

## IDs de referência (Aprovar / Botanique)
- Página FB: `104610745886365` - Ad Account: `act_1155564008436004` - Pixel: `1708075710023708`
- Form instantâneo: `968212722880024` - WhatsApp corretor: `(65) 99232-6461`
- GA4: `G-GXQZBRTHHW` - GTM: `GTM-WKGMFK6B` - Google Ads: `962-696-9646`
- Landing: https://imobiliaria-aprovar.netlify.app/ - Privacidade: https://imobiliaria-aprovar.netlify.app/privacidade.html
- Empreendimento: 441 lotes, 250-347 m², a partir de R$ 312.500, entrada 10%, 24x sem juros (ou plano longo a partir de R$ 3.204/mês). Fase VIP 15/07 - Geral 19/07. Urba / Grupo MRV&CO. Aprovar CRECI 9770J.
