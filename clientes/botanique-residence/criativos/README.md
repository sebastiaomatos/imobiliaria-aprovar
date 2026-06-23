# Criativos — Botanique Residence (Aprovar)

Material de anúncio para captação da **lista VIP** do Botanique Residence (Urba/Grupo MRV&CO),
vendido pela **Aprovar Negócios Imobiliários — CRECI 9770J**. Regra de ouro: **vender a
transformação** (o lago, a praia particular, o refúgio, o patrimônio, a casa dos sonhos),
nunca o terreno. Branding Aprovar (#F57F17 / #004310 / areia #F7F5EE / WhatsApp #25D366),
headline serifada em itálico, **logo transparente** da Aprovar sobre o render.

> Fonte de verdade dos dados: [`../dados/empreendimento.md`](../dados/empreendimento.md) e
> `../dados/tabela-precos.csv`. Nunca inventar preço, metragem, condição ou data.

## Estrutura

| Pasta / arquivo | O que é |
|---|---|
| [`estaticos/`](estaticos/) | 6 peças avulsas `c1..c6` (feed 1:1 e story 9:16) |
| [`carrossel/`](carrossel/) | 5 cards em sequência `card1..5` (4:5) — a ORDEM importa |
| [`performance-max/`](performance-max/) | 3 imagens p/ Google PMax/Demand Gen (1.91:1, 1:1, 4:5) |
| [`roteiros-videos.md`](roteiros-videos.md) | 3 roteiros de Reels/vídeo (walkthrough, condições, depoimento) |
| [`videos/`](videos/) | 3 vídeos REAIS (hook / showcase / prova) — catálogo abaixo. Fontes locais (fora do git por tamanho); contact sheets em `videos/_frames/` + selo `seal-creci-aprovar.png` (overlay) versionados |
| [`fontes/`](fontes/) | HTML + `_base.css` (estáticos) + `_base2.css` (carrossel/pmax) + `img/` — para regenerar |

## Estáticos — `estaticos/`

| Arquivo | Formato (alvo) | Ângulo | ICP |
|---|---|---|---|
| c1-story-vip | Story 9:16 (1080×1920) | Escassez / lista VIP | geral |
| c2-feed-vip | Feed 1:1 (1080×1080) | Escassez / lista VIP | geral |
| c3-story-natureza | Story 9:16 (1080×1920) | Estilo de vida (lago) | família |
| c4-feed-oferta | Feed 1:1 (1080×1080) | Oferta (R$ 312.500) | geral |
| c5-feed-investidor | Feed 1:1 (1080×1080) | Patrimônio tangível | investidor |
| c6-story-construir | Story 9:16 (1080×1920) | Construir do seu jeito | construir |

## Carrossel — `carrossel/` (4:5, 1080×1350) · publicar em ordem card1 → card5

1. **card1** — Capa/gancho: "Um lago e uma praia particular. Em Cuiabá." (com "arraste →")
2. **card2** — A natureza: lago, pier e pôr do sol.
3. **card3** — O lazer: piscina, quadra, pista de 1,4 km, playground, pet place…
4. **card4** — As condições: lote a partir de R$ 312.500, entrada, 24x, parcela longa.
5. **card5** — CTA/VIP: entre na lista VIP, datas 15/07 e 19/07, WhatsApp.

Publicar como carrossel no Instagram/Facebook (feed 4:5 ou anúncio carrossel). O indicador
de "arraste" e os pontinhos guiam o usuário.

## Performance Max / Demand Gen / Display — `performance-max/`

Texto propositalmente MÍNIMO: no PMax o Google combina a imagem com os títulos/descrições
cadastrados à parte; imagens limpas performam melhor e evitam recusa por excesso de texto.

| Arquivo | Tamanho (alvo) | Proporção | Slot do Google |
|---|---|---|---|
| pmax-land | 1200×628 | 1.91:1 | Imagem horizontal (obrigatória) |
| pmax-sq | 1200×1200 | 1:1 | Imagem quadrada (obrigatória) |
| pmax-port | 960×1200 | 4:5 | Imagem retrato (recomendada) |

**Faltam (cadastrar à parte no Google Ads):** logos 1:1 (1200×1200) e paisagem 4:1 (1200×300),
geradas do kit `_templates/branding/` — **TODO**; títulos/descrições do banco
[`../copy/copy-botanique.csv`](../copy/copy-botanique.csv). Dá para exportar versões SEM texto
(só render + logo) removendo o `<h1>`/kicker no HTML e re-renderizando.

## Vídeos — roteiros + peças reais

**Roteiros (para gravar/editar):** [`roteiros-videos.md`](roteiros-videos.md) — 3 roteiros 9:16
(walkthrough do lago, condições, depoimento-conceito) com brief de produção, ferramentas e B-roll.

**Vídeos REAIS já disponíveis** (`videos/` — fontes locais, fora do git por tamanho; quadros de
inspeção versionados em [`videos/_frames/`](videos/_frames/)):

| Arquivo | Dur · Resolução · Proporção | Papel no funil | Uso / reenquadre |
|---|---|---|---|
| `video-naturalmente-o-seu-melhor-espaco.mp4` | 10s · 1024×576 · **16:9** | **Hook / awareness** — aéreo cinematográfico do lago ao pôr do sol + tagline "Naturalmente, o seu melhor espaço" | Feed/YouTube nativo; **reenquadrar 9:16** p/ Reels/Stories. Curto = ótimo gancho. Sugestão: hero da landing em loop mudo. |
| `video-maquete-aprovar.mp4` | 24,5s · 2160×3840 · **9:16** (4K) | **Showcase / consideração** — maquete física do masterplan (lago, quadras, clube, lotes), marca Aprovar | Reels/Stories nativo; cortar p/ **15–20s** em anúncio; reenquadrar 1:1/16:9 p/ Feed. ⚠️ **247 MB** — comprimir antes de subir. |
| `video-filmagem.mov` | 21s · 1080×1920 · **9:16** (HEVC) | **Prova / autenticidade** — filmagem real da portaria/obra + legendas factuais ("Lotes 250–347 m²", "região do Coxipó · Cuiabá") | Reels/Stories, orgânico e **retargeting**. ⚠️ Traz marca **Urba** (sem CRECI/Aprovar) — em anúncio pago, sobrepor o selo **`seal-creci-aprovar.png`** (lower-third 561×108, em `videos/`). Converter HEVC→H.264 p/ compatibilidade. |

> **Conformidade conferida nos quadros** (`_frames/`): sem promessa de valorização, sem preço/erro
> de data nas legendas. **Áudio não transcrito** — se houver locução com claims, revisar antes de
> veicular. **TODO:** `{{VIDEO_FLYTHROUGH_URL}}` (flythrough oficial Urba/MRV, se vier).
>
> **Selo CRECI (lower-third 561×108) — 3 variantes em `videos/`:**
> - `seal-creci-aprovar.png` — fundo verde sólido + borda laranja (selo "fechado", máxima legibilidade).
> - `seal-creci-aprovar-transp.png` — **fundo transparente**, mantém a borda laranja.
> - `seal-creci-aprovar-transp-sem-borda.png` — **fundo transparente, sem borda** (só logo + divisória +
>   "CRECI 9770J"); é o aplicado no export `filmagem-h264-creci.mp4`.
>
> Sobrepor no `video-filmagem` (e em qualquer peça com marca Urba) ao veicular no pago.

## Logo

Versão **transparente** do kit (`_templates/branding/aprovar-logo-darkbg.png` p/ fundo escuro,
`-lightbg.png` p/ fundo claro), aplicada **direto sobre o render** com leve drop-shadow para
leitura — **sem caixa/cartão**. Cópia local em [`fontes/img/aprovar-logo.png`](fontes/img/).

## Avisos legais (mínimos, por peça)

Só o necessário e discreto: **CRECI 9770J sempre**; "imagens ilustrativas (render)"; "valores
sujeitos a alteração" **apenas quando a peça mostra preço** (ex.: c4, card4, pmax com preço).
Peças sem preço não levam aviso de valores. Avisos completos vivem na landing.

## Conformidade

CRECI 9770J · **nunca** prometer valorização (investidor usa patrimônio **tangível**, não
retorno) · render ilustrativo · datas 15/07 (VIP) e 19/07 (geral, provisórias) **a confirmar com a Urba**.

## Regenerar / variar (fontes/)

HTML + `_base.css` (estáticos) e `_base2.css` (carrossel/pmax). Para variar: duplicar um
`.html`, trocar imagem + headline + chips, renderizar com Playwright (viewport = dimensão-alvo;
screenshot do elemento `#cap`).

> ⚠️ **Dimensões dos PNG atuais:** o export está **~48 px mais estreito** que o alvo de cada
> slot (estáticos 1032 px de largura; carrossel 1032×1350; pmax 1152/912). As proporções ficam
> levemente fora do exato (1:1, 9:16, 4:5, 1.91:1). Os arquivos são válidos e publicáveis, mas
> para bater o pixel exato dos slots, **re-renderizar das `fontes/`** ajustando a largura de
> captura (a largura do `#cap`/viewport) — atenção que isso pode reposicionar quebras de texto.
