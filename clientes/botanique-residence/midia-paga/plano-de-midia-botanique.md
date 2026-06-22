# Plano de mídia — Lançamento Botanique Residence (Aprovar)

> Campanhas pagas em **rascunho/pausadas** até o "play" simultâneo. Objetivo nº 1 da fase
> atual: **encher a lista VIP** de cadastros qualificados antes de 15/07.
> Vendido pela Aprovar Negócios Imobiliários — CRECI 9770J. Empreendimento Urba (Grupo MRV&CO).
>
> ⚠️ As metas de CPL/CAC/ROAS abaixo são **alvos para validar no ar**, não garantias. Imóvel
> de ticket alto pode ter CPL maior que o de captação comum — medir nos primeiros dias e ajustar.

## 1. Visão geral
- **Campanha:** "Botanique VIP — Lançamento".
- **Objetivo primário (SMART):** gerar o máximo de **cadastros VIP qualificados** na landing
  entre hoje e 14/07, ao menor CPL viável (alvo de referência ~R$12), alimentando a fase VIP
  (15–18/07) e o lançamento geral (19/07+).
- **Secundário:** iniciar **conversas no WhatsApp** (atendimento humano + régua) e construir
  públicos de retargeting para as fases seguintes.

## 2. Público
- **Geo:** Cuiabá + Várzea Grande e região (raio ~30–50 km). PT-BR.
- **ICP 1 — Família (morar):** 30–55, classes A/B, valoriza segurança, lazer, lago/praia,
  memórias. Dor: qualidade de vida e espaço para a família. Criativos: estilo de vida (lago).
- **ICP 2 — Investidor:** 30–60, interesse em investimentos/mercado imobiliário, busca ativo
  real e proteção patrimonial. Dor: dinheiro parado/voláteis. Criativos: patrimônio (sem
  promessa de valorização).
- **ICP 3 — Construir:** 30–55, quer projeto próprio, terreno em condomínio fechado. Dor:
  liberdade e endereço. Criativos: "o terreno é seu".
- **Retargeting:** visitou a landing sem cadastrar; engajou IG/FB; assistiu 25%+ dos vídeos;
  lista de e-mail (custom audience).

## 3. Mensagens-núcleo (já refletidas nos criativos/copy)
- Núcleo: **"Um condomínio fechado com lago e praia particular chegou a Cuiabá — e quem entra
  na lista VIP escolhe os melhores lotes 4 dias antes."**
- Apoios: (1) lago/praia/lazer pronto; (2) condições de lançamento (a partir de R$ 312.500,
  10% entrada, 24x sem juros); (3) escassez real da fase VIP (15/07 vs geral 19/07);
  (4) ângulo por ICP.

## 4. Rastreamento de conversão (FAZER ANTES de tudo — é o que torna a otimização possível)
1. **GA4** (G-GXQZBRTHHW): marcar o evento **`lead_submit`** (dispara só no sucesso do
   cadastro) como **Conversão/Evento-chave**. Conferir em DebugView/Tempo real.
2. **Meta** (Pixel 1708075710023708): evento padrão **`Lead`** no sucesso do cadastro;
   idealmente **CAPI** (server-side pelo orquestrador) para precisão. Otimizar os conjuntos
   para `Lead`. Para CTWA, otimizar para **"conversa iniciada"**.
3. **Google Ads** (962-696-9646): importar o `lead_submit` do GA4 como **conversão** e usar
   como meta de Search e Performance Max.
4. **UTMs no link** → a landing repassa ao `/cadastro` e grava em `fonte` do lead (já previsto
   no orquestrador). Padrão de UTM no item 9.

## 5. Estrutura — Meta Ads
**Campanha A — Cadastro VIP** · Objetivo **Leads** (conversão `lead_submit` no site) · destino = landing
- Conjuntos por ICP (orçamento por conjunto ou CBO):
  - AS1 **Família** — interesses: imóveis, decoração/casa, família, escolas particulares.
  - AS2 **Investidor** — interesses: investimentos, mercado imobiliário, renda fixa, empreendedorismo.
  - AS3 **Construir** — interesses: arquitetura, construção civil, casa própria.
  - AS4 **Amplo / Advantage+** — sem segmentação detalhada, deixa o algoritmo encontrar.
- Anúncios (por conjunto): **story 9:16 (c1/c3/c6) + feed 1:1 (c2/c4/c5) + carrossel**.
- Lance: começar **maior volume**; depois **limite de custo** perto do CPL alvo.

**Campanha B — Conversas WhatsApp (CTWA)** · Objetivo **Engajamento → conversas** · destino = WhatsApp
- 1–2 conjuntos (amplo + 1 por ICP). Anúncios: c1, c3 e o depoimento (quando o vídeo existir).
- Otimizar para **conversa iniciada**; a régua/atendimento assume.

**Campanha C — Retargeting** · Objetivo **Leads**
- Públicos: visitantes da landing sem cadastro (7/14/30 dias), engajadores IG/FB, video-viewers
  25%+, lista de e-mail. Anúncios: oferta/escassez (c4, c1) e depoimento.

**Colocações:** Advantage+ (Reels, Stories, Feed, Explorar). Mapa no item 8.

## 6. Estrutura — Google Ads
**Campanha 1 — Search (alta intenção)** · destino = landing
- Grupos de anúncio + palavras (correspondência de frase/ampla modificada):
  - **Marca/empreendimento:** "botanique residence", "botanique cuiabá", "botanique urba".
  - **Lote/terreno condomínio:** "lote em condomínio fechado cuiabá", "terreno cuiabá",
    "loteamento fechado cuiabá", "comprar lote cuiabá".
  - **Condomínio com lago:** "condomínio com lago cuiabá", "condomínio clube cuiabá".
- **RSAs** com headlines/descrições do `copy-botanique.csv`. Extensões: sitelinks, frases de
  destaque, local, formulário de lead (opcional).
- **Negativas:** aluguel, alugar, emprego, vaga, mobiliado, apartamento (se foco é lote), usado.

**Campanha 2 — Performance Max** · destino = landing
- Grupo de recursos "Botanique": **assets PMax** (1200×628, 1200×1200, 960×1200) + **logos**
  (quadrado 1:1 e 4:1 — gerar do kit de marca) + headlines/descrições do CSV. **Sinais de
  público:** segmento personalizado de quem busca lote/condomínio em Cuiabá.

**Campanha 3 (opcional) — Demand Gen** · YouTube/Discover/Gmail
- Os criativos visuais (story/feed/carrossel) e os Reels quando prontos.

## 7. ⚠️ Categoria especial de anúncio (Meta) — verificar na criação
Imóvel/financiamento pode acionar a **categoria especial "Crédito/Habitação"** no Meta. Se o
sistema pedir, **declare corretamente** — isso **limita a segmentação detalhada** (idade,
gênero, CEP e impõe raio mínimo). Estratégia nesse caso: apoiar-se em **geo + criativo que
qualifica** (a própria peça fala de preço/condições e atrai o perfil certo). No Google não há
equivalente para venda de lote, mas siga as políticas de imóveis.

## 8. Mapa criativo → colocação
| Criativo | Formato | Onde |
|---|---|---|
| c1-story-vip, c3-story-natureza, c6-story-construir | 9:16 | Reels/Stories (Meta), Demand Gen |
| c2-feed-vip, c4-feed-oferta, c5-feed-investidor | 1:1 | Feed (Meta) |
| carrossel (5 cards) | 4:5 | Feed/Explorar (Meta) |
| pmax-land/sq/port | 1.91:1 / 1:1 / 4:5 | Google PMax/Demand Gen |
| Reels (3 roteiros) | 9:16 | Reels/Stories, Demand Gen (quando produzidos) |

## 9. Nomenclatura + UTM (rastreio limpo)
- **Nome:** `PLATAFORMA_BOTANIQUE_OBJETIVO_PUBLICO_FORMATO`
  (ex.: `META_BOTANIQUE_LEAD_FAMILIA_STORY`, `GADS_BOTANIQUE_SEARCH_MARCA`).
- **UTM (modelo):**
  `?utm_source=meta&utm_medium=paid_social&utm_campaign=botanique_vip_lancamento&utm_content={{nome-do-criativo}}`
  Google Search: `utm_source=google&utm_medium=cpc&utm_campaign=botanique_search&utm_term={keyword}`.
- A landing deve repassar as UTMs ao `/cadastro` (gravar em `fonte`).

## 10. Orçamento — R$ 2.000 em 30 dias
Verba total **R$ 2.000** (~R$ 67/dia de média), repartida **por fase** (o peso muda conforme o momento):

| Fase | Período | Dias | Verba | Diário médio | Foco |
|---|---|---|---|---|---|
| 0 — Captação VIP | hoje → 14/07 | ~22 | **R$ 1.150** | ~R$ 52 | encher a lista (aquisição fria) |
| 1 — Fase VIP | 15 → 18/07 | ~4 | **R$ 450** | ~R$ 112 | retargeting + WhatsApp (converter VIP) |
| 2 — Lançamento geral | 19/07 em diante | ~3+ na janela | **R$ 300** | ~R$ 100 | oferta/urgência + retargeting |
| Reserva | — | — | **R$ 100** | — | reforçar o que tiver melhor custo |

**Split por plataforma na Fase 0 (~R$ 52/dia):** Meta **75%** (~R$ 39) · Google **25%** (~R$ 13).
- **Meta (~R$ 39/dia):** Cadastro VIP ~R$ 27 · CTWA ~R$ 8 · Retargeting ~R$ 4.
- **Google (~R$ 13/dia):** Search ~R$ 9 · Performance Max ~R$ 4.

**Princípio com verba enxuta:** não pulverizar. Concentrar no **Meta** (Cadastro VIP + CTWA),
que é o melhor motor para encher a lista; manter **Google Search** só na intenção quente
("lote condomínio Cuiabá", "Botanique"); **Performance Max entra leve** (precisa de volume de
conversão p/ performar — aqui é mais teste que motor). Reavaliar a cada 3 dias e remanejar
para o melhor CPL. **Foco em lead qualificado, não em volume bruto.**

**Expectativa honesta de CPL:** a R$ 12/lead, os R$ 1.150 da captação dariam ~95 cadastros;
porém lote de ticket alto costuma ter **CPL maior (R$ 20–40)**, o que levaria a ~30–55
cadastros qualificados. O número real aparece nos 3 primeiros dias — então remanejar a verba
conforme o custo observado.

## 11. Calendário por fase
- **Fase 0 — hoje → 14/07 (captação VIP):** todas as campanhas de aquisição ON. KPI: cadastros.
  E-mails 1–3 e régua nutrem os cadastrados.
- **Fase 1 — 15 → 18/07 (fase VIP):** reduzir aquisição fria; **intensificar retargeting +
  CTWA** para converter os cadastrados; escassez. E-mail 4 (15/07) e 5 (reta final).
- **Fase 2 — 19/07+ (lançamento geral):** reativar aquisição com **criativos de oferta/urgência**
  (c4) e "últimas unidades"; retargeting forte. E-mail 6 (19/07).
- **Refresh criativo** a cada 2–3 semanas ou quando a frequência passar de ~2,5.

## 12. Métricas e cadência
- **Primária:** nº de cadastros VIP e **CPL**.
- **Secundárias:** CTR; taxa de conversão da landing; conversas iniciadas e custo por conversa;
  **tempo de 1ª resposta (<5 min)**; CAC; ROAS (pós-venda); frequência.
- **Cadência:** diária nos 3 primeiros dias (aprovação, entrega, CPL), depois 2–3x/semana.
- **Regras de corte/escala:** pausar anúncio com CTR persistente <0,8% e CPL ~2x acima da meta
  após gasto mínimo de aprendizado; **escalar +20% a cada 2–3 dias** os conjuntos com CPL
  abaixo da meta (sem resetar aprendizado).

## 13. Riscos e mitigação
- **Categoria especial limitando segmentação** → geo + criativo qualificador; públicos amplos.
- **CPL acima da meta (ticket alto)** → reforçar topo (CTWA/vídeo), melhorar a landing, ajustar
  expectativa de CPL; não sacrificar qualidade do lead por volume.
- **DNS/landing atrasarem** → começar no subdomínio Netlify (já funciona sem DNS custom).
- **Conformidade** → nunca "valorização garantida"; CRECI 9770J; render ilustrativo (já nos ativos).

## 14. Montagem em RASCUNHO (passo a passo — deixar tudo pausado)
**Meta** ([business.facebook.com](https://business.facebook.com)):
1. Conferir Pixel + evento `Lead`/`lead_submit` (Gerenciador de Eventos → Testar eventos).
2. Criar **Campanha A** (Leads) → conjuntos AS1–AS4 → subir anúncios (mapa do item 8) → **deixar em rascunho/pausado**.
3. Criar **Campanha B** (CTWA) e **C** (Retargeting) idem, pausadas.
4. Definir orçamentos (item 10), públicos (item 2), colocações Advantage+. Declarar categoria especial se pedir (item 7).

**Google** ([ads.google.com](https://ads.google.com)):
1. Importar conversão `lead_submit` do [GA4](https://analytics.google.com).
2. Criar **Search** (grupos/keywords/negativas/RSA/extensões) — **pausada**.
3. Criar **Performance Max** (assets + logos + sinais de público) — **pausada**.
4. Conferir tracking/UTM e orçamentos.

**Pré-requisitos do "play":** landing publicada e testada (cadastro → Praedium + Brevo);
chaves rotacionadas + webhook Praedium recriado; data oficial confirmada com a Urba.

## 15. Próximos passos
- Gerar **logos PMax** (1:1 e 4:1) a partir do kit de marca (posso fazer no Desktop).
- Confirmar **data oficial** (usando **15/07** provisório) e **{{VAGAS_VIP}}** com a Urba.
- Montar as campanhas em rascunho (este documento) — posso te guiar tela a tela quando for a hora.
