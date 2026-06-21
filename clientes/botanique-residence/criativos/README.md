# Criativos — Botanique Residence (Aprovar) · BRIEF

Briefing-mestre dos criativos de anúncio para captação da **lista VIP**. Regra de ouro:
**vender a transformação** (o lago, o refúgio, o patrimônio tangível, a casa dos sonhos),
nunca o terreno. Branding Aprovar (#F57F17 / #004310 / areia #F7F5EE / WhatsApp #25D366),
fonte serifada em itálico (Fraunces) para a headline, logo da Aprovar presente em toda peça.

> Fonte de verdade dos dados: [`../dados/empreendimento.md`](../dados/empreendimento.md) e
> `../dados/tabela-precos.csv`. **Nunca** inventar preço, metragem, condição ou data.

## Status

✅ **Primeira leva produzida** em [`criativos-final/`](criativos-final/) — 6 peças em PNG
alta + fontes HTML/CSS (editáveis e re-renderizáveis com Playwright). Veja o
[README de lá](criativos-final/README.md) para a lista e o fluxo de edição.

| Arquivo | Formato | Ângulo | ICP |
|---|---|---|---|
| c1-story-vip | 9:16 | Escassez / lista VIP | geral |
| c2-feed-vip | 1:1 | Escassez / lista VIP | geral |
| c3-story-natureza | 9:16 | Estilo de vida (lago) | família |
| c4-feed-oferta | 1:1 | Oferta (R$ 312.500) | geral |
| c5-feed-investidor | 1:1 | Patrimônio tangível | investidor |
| c6-story-construir | 9:16 | Construir do seu jeito | construir |

## Formatos a cobrir (roadmap)

- **Feed 1:1** (1080×1080) — ✅ c2, c4, c5. Cobrir família-morar e construir em 1:1.
- **Story / Reels 9:16** (1080×1920) — ✅ c1, c3, c6. Cobrir investidor e oferta em 9:16.
- **Carrossel** (1080×1080, 3–5 cards) — _a produzir_: card 1 gancho (lago) → 2 lazer →
  3 condições (24x sem juros | plano longo) → 4 escassez VIP → 5 CTA WhatsApp.
- **Reels / vídeo curto** (roteiro) — _a produzir_: 0–3s gancho aéreo do lago; 3–8s praia +
  lazer; 8–12s "lista VIP escolhe antes"; 12–15s CTA. Áudio trend + legenda (ver
  `../copy/copy-botanique.csv`, ganchos TikTok).
- **PMax / Demand Gen** — _a produzir_: kit de imagens (1.91:1, 1:1, 4:5), 5 headlines
  (≤30c) + 5 descrições (≤90c) do CSV, logo e nome do negócio.

## Ângulos emocionais por ICP (alinhar à landing e ao CSV)

- **Família / morar:** memórias e domingos à beira do lago, segurança dos filhos,
  pertencimento, "clube em casa". Imagens: 01 (aéreo lago), 04 (pier pôr do sol),
  05 (praia), 06 (piscina), 08 (playground).
- **Investidor:** patrimônio **tangível** (terra que se vê e se pisa), proteção contra a
  inflação, escolher os melhores lotes antes. **Sem promessa de valorização** — usar
  "alto potencial de valorização". Imagens: 01, 17 (masterplan), 16 (localização).
- **Construir:** liberdade do projeto, terreno seu, orgulho/legado. Imagens: 01, 02
  (entrada), 17 (masterplan), 07 (cooper).
- **Geral / escassez:** acesso VIP 12/07 antes do lançamento geral 19/07. Imagens: 01, 05.

## Imagens (banco em `../imagens/`)

Hero limpo: **01-vista-aerea-lago** (sem faixa da Urba). ⚠️ Vários renders trazem **faixa
verde lateral + rótulo + marca da Urba** — **recortar** antes de usar em peça da Aprovar.
00-capa é co-branding; evitar em anúncio de captação da Aprovar.

## Logo da Aprovar

- Usar a versão **transparente** do kit: `_templates/branding/aprovar-logo-darkbg.png`
  (sobre fundo escuro) ou `-lightbg.png` (sobre fundo claro); cópia em
  `criativos-final/fontes/img/aprovar-logo.png`.
- Sobre render escuro: logo direto com **drop-shadow** para leitura (como nas peças atuais).
- Sobre área clara: logo dentro de **lockup** (cartão claro arredondado), como no header da landing.
- Nunca distorcer/recolorir; manter respiro. ⚠️ **TODO:** pedir ao cliente a logo em
  **SVG/PNG transparente HD** (a atual é baixa-res) — ver `_templates/branding/README.md`.

## Conformidade (toda peça)

CRECI 9770J sempre visível · "imagens meramente ilustrativas (render)" quando houver render ·
"valores/condições sujeitos a alteração" **quando a peça mostra preço** · **nunca** prometer
valorização garantida · datas 12/07 (VIP) e 19/07 (geral) **a confirmar com a Urba**.
Avisos completos vivem na landing; na peça, só o mínimo e discreto.

## Editar / variar

Fontes em [`criativos-final/fontes/`](criativos-final/fontes/) (HTML + `_base.css`). Para uma
variação: duplicar um `.html`, trocar imagem + headline + chips, renderizar com Playwright
(viewport = a dimensão; screenshot do `#cap`). A produção de **novos formatos** (carrossel,
Reels, PMax) pode ser feita aqui (com render-verify) ou no **Claude Desktop**.
