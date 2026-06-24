# Ficha de configuração das campanhas — Botanique (Meta + Google)

> Para montar **em rascunho/pausado**. Tudo dimensionado para a verba real de **R$ 2.000/30 dias**.
> Conformidade: preços "a partir de" e "sujeitos a alteração"; nunca GARANTIR/PROMETER valorização
> ou retorno (sem %, prazos, "valorização garantida"); valorização só de forma descritiva/hedge
> ancorada em fato ("região em expansão", "potencial de valorização", proximidade de UFMT /
> Shopping 3 Américas), de preferência no ângulo investidor; CRECI 9770J.
>
> ⚠️ **Correção de estratégia (importante):** com R$ 2.000 NÃO se usa um conjunto por ICP (fragmenta
> demais e não sai do aprendizado). A estrutura abaixo concentra a verba em **poucos conjuntos
> amplos**, e a diferenciação por ICP vai nos **criativos/copy** (vários anúncios no mesmo conjunto).

## 0) Pré-requisitos (fazer antes de montar)
- **Meta:** Pixel `1708075710023708` ativo; evento **`Lead`/`lead_submit`** disparando no sucesso do
  cadastro (Gerenciador de Eventos → Testar eventos). Ideal: **CAPI** server-side pelo orquestrador.
- **Google:** importar a conversão **`lead_submit`** do GA4 (G-GXQZBRTHHW) em Ferramentas → Conversões.
- **UTMs** nos destinos (ver final) para o lead gravar `fonte`.
- **Task técnica (Claude Code) — webhook de Meta Lead Ads:** criar `POST /webhook/meta-lead` no
  orquestrador, validando assinatura, puxando o lead via Graph API e roteando para **Praedium +
  Brevo (lista VIP) + régua** em tempo real, gravando `consentimento` e `fonte=meta_form`. O
  orquestrador já tem infra de webhook/idempotência — é incremental. **Sem isso, os leads do
  formulário ficam presos no Meta e o atendimento <5 min não acontece.**

## 1) Orçamento por campanha × fase (R$/dia)
| Campanha | Fase 0 (captação) | Fase 1 (VIP) | Fase 2 (geral) |
|---|---|---|---|
| Meta · A — Cadastro VIP | **35** (20 form + 15 site) | 35 (20+15) | 45 (25+20) |
| Meta · B — Conversas (CTWA) | **15** | 22 | 25 |
| Meta · C — Retargeting | **8** | 28 | 38 |
| Google · Search | **15** | 15 | 20 |
| Google · Performance Max | **0** (liga na Fase 1) | 10 | 15 |
| **Total/dia** | **~73** | ~110 | ~143 |
Janela ~30 d: **Fase 0 ~22 d (até 14/07) a R$ 73/dia ≈ R$ 1.600** · Fase 1 **4 d (15–18/07)** ≈ R$ 440 · Fase 2 ~3 d (19–21/07) ≈ R$ 429 · **total ≈ R$ 2.470** (parte da Fase 2 segue após a janela).

---

# META ADS

### Campanha A — Cadastro VIP
- **Objetivo:** Leads.
- ⚠️ **Local de conversão — testar Formulário nativo × Site:** com verba pequena e meta de encher a
  lista, o **formulário instantâneo costuma dar o menor CPL** (menos atrito). Mas o lead nativo tende
  a ter **menos intenção** e **precisa ser integrado** (senão fica preso no Meta e mata o <5 min).
  Estrutura recomendada — **ABO** (orçamento por conjunto, para comparar justo), total R$ 35/dia:
  - **Conjunto 1 — Formulário instantâneo (PRIMÁRIO) · R$ 20/dia**
    - Tipo: **Maior intenção** (tela de revisão) — melhora a qualidade.
    - Campos: nome, telefone, e-mail + **1 qualificadora**: "Seu objetivo? Morar / Investir / Construir".
    - **Consentimento LGPD** no formulário + link da Política de Privacidade.
    - **Integração obrigatória:** webhook Meta Lead Ads → orquestrador (ver pré-requisitos). `fonte=meta_form`.
  - **Conjunto 2 — Site (BENCHMARK de qualidade) · R$ 15/dia**
    - Otimização **`lead_submit`** na landing (Pixel 1708075710023708); alimenta Pixel + retargeting.
- **Estratégia de lance:** maior volume. **Público:** AMPLO (Cuiabá + Várzea Grande + raio 30 km; 28–60;
  PT; Advantage+). **Posicionamentos:** Advantage+.
- **Anúncios (em ambos os conjuntos):** criativos por ICP (c2–c6 + carrossel) + copy `anuncios-copy.md`.
  - **Vídeos:** `video-naturalmente` (hook do lago, 16:9 → **reenquadrar 9:16** p/ Reels/Stories) e
    `video-maquete-aprovar` (showcase do masterplan, 9:16; cortar p/ 15–20s) para públicos engajados.
- **Decisão:** julgar por **custo por lead QUALIFICADO** (responde no WhatsApp / agenda visita), **não**
  pelo CPL puro. Após ~5–7 dias, migrar a verba para o vencedor (form costuma ganhar volume; site, qualidade).

### Campanha B — Conversas (CTWA → WhatsApp)
- **Objetivo:** Engajamento → **Mensagens**, destino **WhatsApp** (número (65) 99232-6461).
- **Orçamento:** R$ 15/dia (Fase 0). **Otimização:** conversas iniciadas. **Lance:** maior volume.
- **Conjunto único "AMPLO":** mesma localização/idade/idioma da Campanha A; segmentação aberta. Posicionamentos Advantage+.
- **Anúncios:** c1 e c3 + **vídeo `video-naturalmente`** (hook do lago, 9:16) + copy da seção Meta · Campanha B. CTA **Enviar mensagem**. Mensagem de saudação automática puxando o lead para a régua.

### Campanha C — Retargeting
- **Objetivo:** Leads (mesmo pixel/evento da Campanha A).
- **Orçamento:** R$ 8/dia (Fase 0; sobe forte nas fases 1 e 2). **Lance:** maior volume.
- **Conjunto único — Público personalizado (combinar):**
  - Visitantes da landing **30 dias** **EXCLUINDO** quem já converteu (`lead_submit`);
  - Engajou IG/FB **365 dias**; quem viu **25%+** dos vídeos.
- **Posicionamentos:** Advantage+. **Anúncios:** c4 (oferta) e c1 (VIP) + copy da seção Meta · Campanha C.
  - **Vídeos:** `video-filmagem` (prova/autenticidade — portaria e obra reais, 9:16) e
    `video-maquete-aprovar` (showcase do masterplan, 9:16) — fortes para quem já visitou/engajou.
- ⚠️ Público de retargeting começa pequeno (pouco tráfego no início) — pode levar uns dias para encher.

---

# GOOGLE ADS

### Campanha 1 — Search
- **Tipo:** Pesquisa. **Meta:** Leads. **Rede:** **só Pesquisa** (DESMARCAR Rede de Display e parceiros).
- **Orçamento:** R$ 15/dia. **Lances:** **Maximizar cliques** na 1ª semana (juntar dados) → trocar para
  **Maximizar conversões** quando o `lead_submit` importado tiver volume.
- **Locais:** Cuiabá + região (alvo: "**presença** — pessoas que estão/moram regularmente"). **Idioma:** Português.
- **Públicos:** adicionar em **Observação** (não restringir): "no mercado — imóveis".
- **Grupos de anúncio + palavras (frase):** Marca · Lote/terreno · Lago/clube (ver `anuncios-copy.md`).
- **Negativas:** aluguel, alugar, emprego, vaga, apartamento, usado.
- **RSAs:** 15 títulos + 4 descrições (ver `anuncios-copy.md`). **Extensões:** sitelinks, frases de destaque, snippet.
- **Caminho de URL:** /lista-vip. Destino com UTM.

### Campanha 2 — Performance Max
- **Tipo:** Performance Max. **Meta de conversão:** `lead_submit`. **Orçamento:** R$ 0 na Fase 0 — liga na Fase 1 (R$ 10/dia) e reforça na Fase 2 (R$ 15/dia).
- **Grupo de recursos "Botanique":** assets PMax (1200×628, 1200×1200, 960×1200) + **logos** (1:1 e 4:1 de
  `_templates/branding/pmax/`) + títulos/descrições (ver `anuncios-copy.md`). **Sinais de público:**
  segmento personalizado "lote/condomínio fechado Cuiabá" + dados do site.
- ⚠️ **PMax desligado na Fase 0** (R$ 0); entra na **Fase 1** (R$ 10/dia) ainda como teste — performa com
  volume de conversão — e vira reforço na Fase 2 (R$ 15/dia).

---

## Públicos (definições exatas, reutilizáveis)
- **Geo padrão:** Cuiabá, MT + Várzea Grande, MT + raio 30 km · "moram aqui".
- **Custom — Visitantes Landing 30d (sem cadastro):** fonte Pixel/site, 30 dias, **excluir** `lead_submit`.
- **Custom — Engajou IG/FB 365d** · **Custom — Vídeo 25%+ 365d**.
- **Custom — Lista VIP (e-mail):** upload do Brevo (também semente de Lookalike).
- **Lookalike 1% (futuro):** semente = quem fez `lead_submit` (criar quando houver ~100+).

## Posicionamentos
- Meta: **Advantage+ (automáticos)** em todas — com verba pequena é o que entrega melhor. Story/Reels recebem
  os 9:16 (c1/c3/c6); Feed/Explorar recebem 1:1 (c2/c4/c5) e o carrossel.
- Google: Search só na Rede de Pesquisa; PMax cobre YouTube/Display/Discover/Gmail/Maps automaticamente.

## ⚠️ Categoria especial de anúncio (Meta)
Na criação, o Meta pode pedir para declarar **"Crédito/Habitação"**. Se pedir, **declare** — isso trava
idade/gênero/CEP e impõe raio mínimo. Aí a estratégia se apoia em **geo + criativo que qualifica** (a peça
já fala de preço/condições).

## Nomenclatura + UTM (padrão único — alinhado ao runbook-manual-meta.md)

### Nomenclatura (UTM-safe: minúsculas, sem acento, hífens)
> Regra de ouro: o NOME do anúncio = valor de utm_content (via macro). Nada de espaço/acento.
- Campanhas: `meta-bot-leads-cadastro-vip` · `meta-bot-msg-conversas` · `meta-bot-leads-retargeting` · `gads-bot-search` · `gads-bot-pmax`
- Conjuntos: `meta-bot-leads-formulario` · `meta-bot-leads-site` · `meta-bot-msg-amplo` · `meta-bot-leads-rtg-site30d`
- Anúncios: `ad-<angulo>-<criativo>-<formato>` (ex.: `ad-familia-c3-story`, `ad-investidor-c5-feed`, `ad-amplo-carrossel`)
- Grupos Search: `ag-marca` · `ag-lote` · `ag-lago` · Grupo de recursos PMax: `rg-botanique`

### UTM (tag fixa por campanha + macros dinâmicos)
> Onde colar — Meta: Anúncio → Rastreamento → "Parâmetros de URL do site". Google: Campanha → Opções de URL → "Sufixo do URL final" (sem `?`). Auto-tagging do Google ligado.
| Campanha | UTM |
|---|---|
| Meta A-Site | utm_source=meta&utm_medium=paid_social&utm_campaign=botanique-cadastro-vip&utm_content={{ad.name}}&utm_term={{adset.name}} |
| Meta A-Formulário | (sem URL — atribuição via fonte=meta_form) |
| Meta B-Conversas | (sem URL — atribuição via referral do CTWA) |
| Meta C-Retargeting | utm_source=meta&utm_medium=paid_social&utm_campaign=botanique-retargeting&utm_content={{ad.name}}&utm_term={{adset.name}} |
| Google Search | utm_source=google&utm_medium=cpc&utm_campaign=botanique-search&utm_content={creative}&utm_term={keyword} |
| Google PMax | utm_source=google&utm_medium=pmax&utm_campaign=botanique-pmax&utm_content={campaignid} |

A landing repassa as UTMs ao `/cadastro` (grava em `fonte`).

## Ordem de montagem (rascunho)
1. Conferir pixel/evento `lead_submit` (Meta) e importar conversão (Google).
2. Meta: criar A (CBO, 1 conjunto amplo, anúncios) → B (CTWA) → C (Retargeting). **Tudo pausado.**
3. Google: criar Search (grupos/keywords/RSA/extensões) → PMax (assets+logos+sinais). **Tudo pausado.**
4. Revisar orçamentos (tabela acima), públicos e UTMs. Declarar categoria especial se pedir.
5. **Play** só depois de: landing publicada e testada + chaves rotacionadas + webhook Praedium + data confirmada.
