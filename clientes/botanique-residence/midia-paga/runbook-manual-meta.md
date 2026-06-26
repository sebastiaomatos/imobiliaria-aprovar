# Runbook manual — Meta Ads + Google Ads — Botanique VIP (Aprovar) — v2

> A peça-pipeline do projeto. Tudo em **rascunho/PAUSADO**. Estratégia: poucos conjuntos amplos, diferenciar por criativo/copy (config-campanhas.md). Copy abaixo está **pronta pra colar** (já com quebras de linha/emojis) — copie o bloco cinza inteiro.
> Conformidade: **CRECI 9770J** sempre; "imagens ilustrativas (render)"; "valores sujeitos a alteração" só onde aparece preço; **nunca** prometer valorização. Fontes auditadas: `criativos/README.md`, `criativos/roteiros-videos.md`, `anuncios-copy.md`, `config-campanhas.md`.

## INVENTÁRIO REAL DE CRIATIVOS (nomes exatos do repo)
Base: `clientes/botanique-residence/criativos/`

**Estáticos** (`criativos/estaticos/`):
- `c1-story-vip.png` — Story 9:16 — escassez/lista VIP (geral)
- `c2-feed-vip.png` — Feed 1:1 — escassez/lista VIP (geral)
- `c3-story-natureza.png` — Story 9:16 — estilo de vida/lago (família)
- `c4-feed-oferta.png` — Feed 1:1 — oferta R$ 312.500 (geral) — mostra preço
- `c5-feed-investidor.png` — Feed 1:1 — patrimônio tangível (investidor)
- `c6-story-construir.png` — Story 9:16 — construir do seu jeito (construir)

**Carrossel** (`criativos/carrossel/`) — publicar em ORDEM card1→card5 (4:5):
- `card1.png` capa/gancho · `card2.png` natureza · `card3.png` lazer · `card4.png` condições (mostra preço) · `card5.png` CTA/VIP

**Vídeos — usar a pasta `exports/`** (`criativos/videos/exports/`):
- `naturalmente-9x16.mp4` — hook do lago (9:16) — Reels/Stories
- `maquete-1080p.mp4` — showcase do masterplan (cortar p/ 15–20s se o conjunto pedir)
- `filmagem-h264-creci.mp4` — prova/portaria real, **já com selo CRECI** (9:16) — retargeting
- (fontes crus em `criativos/videos/` — NÃO subir os `.mov`/4K direto; use os exports)

**Performance Max** (`criativos/performance-max/`):
- `pmax-land.png` (1.91:1) · `pmax-sq.png` (1:1) · `pmax-port.png` (4:5)
- ⚠️ **Faltam logos PMax** (1:1 1200×1200 e 4:1 1200×300) — usar `aprovar-pmax-logo-1x1.png` e `aprovar-pmax-logo-4x1.png` (já gerados; colocar em `_templates/branding/pmax/`).

> ⚠️ Os PNG estão ~48 px mais estreitos que o slot exato (publicáveis; pra pixel-perfect re-renderizar das `fontes/`).

---

## GUIA DE CAMPOS (Meta Ads Manager, PT-BR) — onde cada coisa vai
- **Campanha:** `Objetivo da campanha` · `Nome da campanha` · `Categorias especiais de anúncios` · `Orçamento da campanha Advantage` (deixar **DESLIGADO** = ABO).
- **Conjunto:** `Nome do conjunto de anúncios` · `Local de conversão` · `Pixel`/`Evento de conversão` · `Meta de desempenho` · `Orçamento diário` · `Público` (`Locais`, `Idade`, `Públicos personalizados`, `Controles do Advantage+`) · `Posicionamentos` (Advantage+).
- **Anúncio:** `Nome do anúncio` · `Identidade` (`Página do Facebook` + `Conta do Instagram`) · `Configuração do anúncio` → `Criar anúncio` · `Formato` (`Imagem ou vídeo único` / `Carrossel`) · `Mídia` → `Adicionar mídia` → `Adicionar imagem`/`Adicionar vídeo` (e `Editar por posicionamento` p/ subir 9:16 + 1:1) · `Texto principal` · `Título` · `Descrição` · `Chamada para ação` · `Destino` (`Site` → `URL do site`, ou `Formulário instantâneo`) · `Rastreamento` → `Parâmetros de URL do site`.

## Nomenclatura (UTM-safe: minúsculas, sem acento, hífen)
- Campanhas: `meta-bot-leads-cadastro-vip` · `meta-bot-msg-conversas` · `meta-bot-leads-retargeting` · `gads-bot-search` · `gads-bot-pmax`
- Conjuntos: `meta-bot-leads-formulario` · `meta-bot-leads-site` · `meta-bot-msg-amplo` · `meta-bot-leads-rtg-site30d`
- Anúncios: `ad-<angulo>-<formato>` (ex.: `ad-familia-story`, `ad-investidor-feed`, `ad-amplo-carrossel`, `ad-rtg-prova`)

## UTM (cole sem o `?`) — Meta: Anúncio → Rastreamento → "Parâmetros de URL do site"
| Campanha | UTM |
|---|---|
| A-Site | `utm_source=meta&utm_medium=paid_social&utm_campaign=botanique-cadastro-vip&utm_content={{ad.name}}&utm_term={{adset.name}}` |
| A-Formulário | (sem URL — atribuição via `fonte=meta_form`) |
| B-Conversas | (sem URL — atribuição via referral do CTWA) |
| C-Retargeting | `utm_source=meta&utm_medium=paid_social&utm_campaign=botanique-retargeting&utm_content={{ad.name}}&utm_term={{adset.name}}` |
| Google Search | `utm_source=google&utm_medium=cpc&utm_campaign=botanique-search&utm_content={creative}&utm_term={keyword}` |
| Google PMax | `utm_source=google&utm_medium=pmax&utm_campaign=botanique-pmax&utm_content={campaignid}` |

## Pré-requisitos
- Aceitar Lead Ads ToS (https://www.facebook.com/legal/leadgen/tos) + Públicos Personalizados ToS (https://www.facebook.com/customaudiences/app/tos/?act=1155564008436004).
- Pixel `1708075710023708` disparando `Lead` (Gerenciador de Eventos → Testar eventos).
- Decisão CAPI (plugar `metaCapi.js` OU otimizar Site por "Visualizações da página de destino" no início).
- Geo padrão (todas): Cuiabá, MT + Várzea Grande, MT + raio 30 km · "moram aqui".
- Google: importar a conversão `lead_submit` do GA4 (`G-GXQZBRTHHW`).

---

# 1. META — Campanha A · `meta-bot-leads-cadastro-vip`
Campanha → `Objetivo`: **Leads** · `Nome`: `meta-bot-leads-cadastro-vip` · `Categorias especiais`: **Habitação** (país Brasil) · `Orçamento Advantage`: DESLIGADO.

## Conjunto `meta-bot-leads-formulario` — R$ 20/dia ⚠️(após Lead Ads ToS; entrega depende da BM)
`Local de conversão`: **Formulários instantâneos** · `Meta de desempenho`: **Maximizar número de leads** · `Orçamento diário`: **20,00** · `Público`: geo padrão, idade 28–60, **Advantage+** · `Posicionamentos`: **Advantage+**.
Formulário (`Formulário instantâneo` → usar `968212722880024`): tipo **Maior intenção** · campos nome/telefone/e-mail + qualificadora **"Qual é o seu objetivo? Morar / Investir / Construir"** + consentimento LGPD + privacidade https://imobiliaria-aprovar.netlify.app/privacidade.html

## Conjunto `meta-bot-leads-site` — R$ 15/dia
`Local de conversão`: **Site** · `Pixel`: `1708075710023708` · `Evento de conversão`: **Lead** (ou "Visualizações da página de destino" no início) · `Meta de desempenho`: **Maximizar número de conversões** · `Orçamento diário`: **15,00** · público/posicionamentos iguais · `Destino`→`URL do site`: `https://imobiliaria-aprovar.netlify.app/` + UTM (A-Site).

## Anúncios da Campanha A (crie os mesmos nos 2 conjuntos)
> Em cada anúncio: `Identidade` = Página **Imobiliária Aprovar** + Instagram vinculado · `Formato` conforme abaixo · suba a `Mídia` real · cole `Texto principal`/`Título`/`Descrição` · `CTA` **Cadastre-se** · No Site: `URL` + UTM; no Formulário: selecionar o form (sem URL). Use `Editar por posicionamento` p/ subir **9:16 + 1:1**.

### `ad-familia-story` / `ad-familia-feed` / `ad-familia-video`
Mídia: `criativos/estaticos/c3-story-natureza.png` (9:16) · `criativos/estaticos/c2-feed-vip.png` (1:1) · `criativos/videos/exports/naturalmente-9x16.mp4`
`Texto principal`:
```
Imagina o fim de tarde: as crianças na faixa de areia, o pôr do sol no pier e a sua casa a poucos passos do lago. 🌅

O Botanique Residence está chegando a Cuiabá — um condomínio fechado com lago, praia particular e clube pronto: piscina com pool bar, quadras e pista de cooper de 1,4 km.

Lotes a partir de R$ 312.500, entrada de 10% e 24x sem juros.

Entre na lista VIP e escolha seu lote antes da abertura geral. 👇
```
`Título`: `Lotes à beira de um lago em Cuiabá`
`Descrição`: `Lista VIP aberta · CRECI 9770J`

### `ad-investidor-feed` / `ad-investidor-story`
Mídia: `criativos/estaticos/c5-feed-investidor.png` (1:1) · `criativos/estaticos/c1-story-vip.png` (9:16)
`Texto principal`:
```
Dinheiro parado perde valor. Terra em região nobre de Cuiabá continua sendo terra. 📍

O Botanique Residence — condomínio fechado com lago, pier e estrutura de clube (piscina, quadras, academia) — abre lotes a partir de R$ 312.500, com entrada de 10% e 24x sem juros.

Um ativo real, no seu nome, em um dos endereços mais bem pensados da cidade.

Garanta a melhor posição entrando na lista VIP antes da abertura geral.
```
`Título`: `Seu patrimônio em terra, em Cuiabá`
`Descrição`: `Lista VIP · valores sujeitos a alteração · CRECI 9770J`

### `ad-construir-story` / `ad-construir-feed`
Mídia: `criativos/estaticos/c6-story-construir.png` (9:16) · `criativos/estaticos/c4-feed-oferta.png` (1:1)
`Texto principal`:
```
O terreno é seu. A casa, do seu jeito. 🏡

No Botanique Residence — condomínio fechado com lago, praia e clube de lazer (piscina, quadras, academia, espaço gourmet) — você escolhe um lote de 250 a 347 m² para construir o lar dos seus sonhos.

A partir de R$ 312.500, entrada de 10%, 24x sem juros.

Lista VIP aberta: escolha o seu antes da abertura geral.
```
`Título`: `Seu lote para construir em Cuiabá`
`Descrição`: `250–347 m² · valores sujeitos a alteração · CRECI 9770J`

### `ad-amplo-carrossel` / `ad-amplo-video` / `ad-amplo-feed`
Mídia: `Formato` **Carrossel** com `criativos/carrossel/card1.png`→`card5.png` (NESTA ORDEM) · ou vídeo `criativos/videos/exports/maquete-1080p.mp4` · ou `criativos/estaticos/c2-feed-vip.png` (1:1)
`Texto principal`:
```
Um condomínio fechado com lago, praia particular e estrutura de resort chegou a Cuiabá. 🌳

Do pier à pista de cooper de 1,4 km, com piscina, quadras e clube entregue pronto — um refúgio a poucos minutos da cidade.

Lotes a partir de R$ 312.500, entrada de 10% e 24x sem juros.

Entre na lista VIP e escolha seu lote antes da abertura geral. 👇
```
`Título`: `Lago, praia e lazer em Cuiabá`
`Descrição`: `Lista VIP aberta · CRECI 9770J`

### `ad-oferta-feed`
Mídia: `criativos/estaticos/c4-feed-oferta.png` (1:1)
`Texto principal`:
```
Lote em condomínio fechado, à beira de um lago, em Cuiabá. 🌅

A partir de R$ 312.500 — entrada de 10% (R$ 31.250) e saldo em 24x SEM JUROS. Ou plano longo a partir de R$ 3.204/mês.

A pré-venda começou e os melhores lotes vão primeiro para quem está na lista VIP.

Cadastre-se e escolha antes da abertura geral. 👇
```
`Título`: `Lotes a partir de R$ 312.500`
`Descrição`: `24x sem juros · valores sujeitos a alteração · CRECI 9770J`

---

# 2. META — Campanha B · `meta-bot-msg-conversas` (R$ 15/dia) ⚠️ trava sem WhatsApp na BM
Campanha → `Objetivo`: **Engajamento** · `Categorias especiais`: Habitação · CBO desligado.
Conjunto `meta-bot-msg-amplo`: `Local de conversão`/`Tipo`: **Apps de mensagem → WhatsApp** `(65) 99232-6461` · `Meta de desempenho`: **Maximizar número de conversas** · `Orçamento diário`: **15,00** · público/posicionamentos da A.

### `ad-msg-story` / `ad-msg-feed`
Mídia: `criativos/estaticos/c1-story-vip.png` + `criativos/videos/exports/naturalmente-9x16.mp4` · `criativos/estaticos/c2-feed-vip.png` · `CTA`: **Enviar mensagem**
`Texto principal`:
```
Quer conhecer o Botanique Residence antes de todo mundo? 🌳

Chama no WhatsApp 👉 a gente te manda o mapa dos lotes, as condições de lançamento (entrada de 10%, 24x sem juros) e tira suas dúvidas na hora.

Lotes a partir de R$ 312.500.
```
`Título`: `Fale com a Aprovar no WhatsApp`
Mensagem de saudação automática (campo "Mensagem de saudação" no anúncio):
```
Oi! Que bom seu interesse no Botanique 🌳 Me diz seu nome e seu objetivo (morar, investir ou construir) que eu já te mando o mapa de lotes e as condições.
```

---

# 3. META — Campanha C · `meta-bot-leads-retargeting` (R$ 8/dia) ⚠️ Públicos ToS + Pixel coletando + restrição Habitação
Campanha → `Objetivo`: **Leads** · `Categorias especiais`: Habitação · CBO desligado.
Conjunto `meta-bot-leads-rtg-site30d`: `Local de conversão`: Site · `Pixel`/`Evento`: Lead · `Orçamento diário`: **8,00** · `Públicos personalizados`: **INCLUIR** "Visitantes Landing 30d" + "Engajou IG/FB 365d" + "Vídeo 25%+ 365d"; **EXCLUIR** "Converteram lead_submit 180d" · UTM (C-Retargeting).
> Se Habitação bloquear os públicos personalizados/Lookalike, mantenha só o permitido.

### `ad-rtg-oferta` / `ad-rtg-prova` / `ad-rtg-story`
Mídia: `criativos/estaticos/c4-feed-oferta.png` · `criativos/videos/exports/filmagem-h264-creci.mp4` (já com selo CRECI) · `criativos/estaticos/c1-story-vip.png` · `CTA`: **Cadastre-se**
`Texto principal`:
```
Você viu o Botanique e o lago ficou na cabeça, né? 🌅

A lista VIP ainda está aberta — e quem entra agora escolhe os melhores lotes (perto do lago e do lazer) antes da abertura geral.

Lotes a partir de R$ 312.500, entrada de 10%.

Garanta o seu. 👇
```
`Título`: `Ainda dá tempo de entrar na VIP`
`Descrição`: `Escolha antes da abertura geral · CRECI 9770J`

---

# 4. Públicos (Meta — Gerenciador de Públicos → Criar público → Público personalizado)
- **Visitantes Landing 30d** — fonte **Site (Pixel `1708075710023708`)** · "Todos os visitantes" · 30 dias.
- **Converteram lead_submit 180d** — fonte Pixel · evento **Lead** · 180 dias (exclusão).
- **Engajou IG/FB 365d** — público de engajamento (conta IG + Página FB) · 365 dias.
- **Vídeo 25%+ 365d** — público de vídeo · "assistiram 25%+" · 365 dias.
- **Lista VIP (e-mail)** — upload do Brevo; semente de **Lookalike 1%** (criar com ~100+ leads).

---

# 5. GOOGLE — `gads-bot-search` (Pesquisa)
`Objetivo`: Leads · `Tipo de campanha`: **Pesquisa** · `Redes`: **só Rede de Pesquisa** (DESMARCAR Display e parceiros de pesquisa) · `Orçamento`: **15,00/dia** · `Lances`: **Maximizar cliques** (semana 1) → **Maximizar conversões** (`lead_submit`) com volume · `Locais`: Cuiabá+região, opção **"Presença: pessoas que moram/estão regularmente"** · `Idiomas`: Português · `Públicos-alvo`: adicionar **em Observação** "No mercado: imóveis" · `Mais configurações → Opções de URL → Sufixo do URL final`: UTM (Google-Search) · `Caminho de exibição`: `lista-vip`.
`Palavras-chave negativas`: aluguel, alugar, emprego, vaga, apartamento, usado, mobiliado.

**Grupos de anúncios + palavras (frase):**
- `ag-marca`: "botanique residence", "botanique cuiabá", "botanique urba"
- `ag-lote`: "lote condomínio fechado cuiabá", "terreno cuiabá", "loteamento fechado cuiabá", "comprar lote cuiabá"
- `ag-lago`: "condomínio com lago cuiabá", "condomínio clube cuiabá"

**RSA — campo `Títulos` (15):** `Botanique Residence Cuiabá` · `Lotes em Condomínio Fechado` · `Lago e Praia Particular` · `Lotes a partir de R$312.500` · `Entrada de 10% · 24x s/ Juros` · `Clube de Lazer Completo` · `Lista VIP — Escolha Antes` · `Terrenos de 250 a 347 m²` · `Condomínio com Lago em Cuiabá` · `Lotes para Construir em Cuiabá` · `Pré-lançamento Botanique` · `Pista de Cooper e Piscina` · `Cadastre-se na Lista VIP` · `Aprovar · CRECI 9770J` · `Fale no WhatsApp Agora`
**RSA — campo `Descrições` (4):** `Condomínio fechado com lago, praia e clube de lazer em Cuiabá. Lista VIP aberta.` · `Lotes a partir de R$ 312.500, entrada de 10% e 24x sem juros. Sujeito a disponibilidade.` · `Escolha seu lote antes da abertura geral. Cadastre-se na lista VIP.` · `Aprovar Negócios Imobiliários · CRECI 9770J · Atendimento no WhatsApp.`

**Recursos (extensões):**
- `Sitelinks`: Lista VIP · Condições de lançamento · Lazer e estrutura · Falar no WhatsApp
- `Frases de destaque`: Lago e praia particular · Clube de lazer completo · Entrada de 10% · 24x sem juros · Condomínio fechado
- `Snippets estruturados` (Comodidades): Lago · Praia · Piscina · Pista de cooper · Quadras · Pet place

---

# 6. GOOGLE — `gads-bot-pmax` (Performance Max) — R$ 0 na Fase 0; Fase 1 R$10 / Fase 2 R$15
`Meta de conversão`: `lead_submit` · `Sufixo do URL final`: UTM (PMax).
`Grupo de recursos` `rg-botanique`:
- `Imagens`: `criativos/performance-max/pmax-land.png` (1.91:1) · `pmax-sq.png` (1:1) · `pmax-port.png` (4:5)
- `Logotipos`: `aprovar-pmax-logo-1x1.png` (1:1) + `aprovar-pmax-logo-4x1.png` (4:1) — de `_templates/branding/pmax/`
- `Títulos` (30): `Lotes com Lago em Cuiabá` · `Botanique Residence` · `Lista VIP Aberta` · `Entrada de 10%` · `Clube de Lazer Completo`
- `Títulos longos` (90): `Condomínio fechado com lago e praia particular em Cuiabá — lotes a partir de R$ 312.500` · `Entre na lista VIP do Botanique e escolha seu lote antes da abertura geral`
- `Descrições`: (90) `Lotes de 250 a 347 m², entrada de 10% e 24x sem juros. Sujeito a disponibilidade.` · `Lago, pier, praia, piscina e pista de cooper. Cadastre-se na lista VIP. CRECI 9770J.` · (60) `Condomínio fechado com lago em Cuiabá. Lista VIP.`
- `Nome da empresa`: `Aprovar Imobiliária`
- `Sinais de público`: segmento personalizado "lote / condomínio fechado Cuiabá" + dados do site.

---

# 7. MAPA MESTRE criativo → anúncio (todos os criativos usados)
| Criativo (arquivo) | Vai para |
|---|---|
| `estaticos/c1-story-vip.png` | A `ad-investidor-story` · B `ad-msg-story` · C `ad-rtg-story` |
| `estaticos/c2-feed-vip.png` | A `ad-familia-feed`/`ad-amplo-feed` · B `ad-msg-feed` |
| `estaticos/c3-story-natureza.png` | A `ad-familia-story` |
| `estaticos/c4-feed-oferta.png` | A `ad-oferta-feed`/`ad-construir-feed` · C `ad-rtg-oferta` |
| `estaticos/c5-feed-investidor.png` | A `ad-investidor-feed` |
| `estaticos/c6-story-construir.png` | A `ad-construir-story` |
| `carrossel/card1..5.png` | A `ad-amplo-carrossel` (em ordem) |
| `videos/exports/naturalmente-9x16.mp4` | A `ad-familia-video` · B `ad-msg-story` |
| `videos/exports/maquete-1080p.mp4` | A `ad-amplo-video` |
| `videos/exports/filmagem-h264-creci.mp4` | C `ad-rtg-prova` |
| `performance-max/pmax-land/sq/port.png` | Google PMax |

# 8. Status de bloqueios + gaps
| Item | Situação |
|---|---|
| A-Site | ✅ pode rodar (criativos prontos) |
| A-Formulário | Lead Ads ToS + Lead Access da BM |
| B-Conversas | número WhatsApp vinculado à BM |
| C-Retargeting | Públicos ToS + Pixel coletando + checar restrição Habitação |
| Logos PMax | TODO: colocar `aprovar-pmax-logo-1x1/4x1.png` em `_templates/branding/pmax/` |
| Vídeos | usar `exports/` (não os fontes crus); `maquete` cortar p/ 15–20s se necessário |
| Dimensão dos PNG | ~48px estreitos; publicável; re-renderizar das `fontes/` p/ pixel-perfect |

# IDs
Página `104610745886365` · Ad Account `act_1155564008436004` · Pixel `1708075710023708` · Form `968212722880024` · WhatsApp `(65) 99232-6461` · GA4 `G-GXQZBRTHHW` · GTM `GTM-WKGMFK6B` · Google Ads `962-696-9646` · Landing https://imobiliaria-aprovar.netlify.app/ · CRECI 9770J · 441 lotes, 250–347 m², a partir de R$ 312.500, entrada 10%, 24x sem juros (ou a partir de R$ 3.204/mês). VIP 15/07 · Geral 19/07.
