# Sistema Imóveis AQV — Aprovar Negócios Imobiliários (CRECI 9770J)

Repositório de **marketing e vendas** da Aprovar Negócios Imobiliários (Cuiabá/MT). Reúne, num
só lugar, tudo que captura e nutre um lead até o corretor assumir: **anúncios → landing → CRM →
WhatsApp/e-mail → atendimento**, com um backend de automação que costura as integrações.

Primeiro empreendimento ativo: **Botanique Residence** — condomínio fechado de lotes da **Urba
(Grupo MRV&CO)**, do qual a Aprovar é a **imobiliária parceira na venda** (não a incorporadora).

> **Objetivo do funil:** maximizar **cadastros qualificados na Lista VIP** e responder em **&lt;5 min**.

---

## Como o funil funciona (visão de ponta a ponta)

```
                 Tráfego pago (Meta/Google) + orgânico
                                │
        ┌───────────────────────┼─────────────────────────┐
        ▼                       ▼                          ▼
  Landing VIP            Meta Lead Ads             WhatsApp (inbound)
  (Netlify, estática)    (formulário nativo)       (Z-API)
        │                       │                          │
        │ POST /cadastro        │ POST /webhook/meta-lead  │ POST /webhook/zapi
        └───────────────────────┴─────────────┬────────────┘
                                               ▼
                          orquestrador (Node/Fastify · Railway)
                          ───────────────────────────────────────
                          processarLead():
                            • grava o lead (Postgres) + consentimento + fonte
                            • cria no Praedium (CRM)
                            • adiciona à lista VIP no Brevo (dispara e-mails)
                            • M0 ATIVA proativa no WhatsApp (se opt-in)
                            • notifica o CORRETOR de todo lead novo
                          régua inbound (WhatsApp): M0 → R1..R5b + opt-out (SAIR)
                                               │
                                               ▼
                                    Corretor humano assume
```

Detalhes técnicos de cada rota, idempotência, segurança e deploy: **[`orquestrador/README.md`](orquestrador/README.md)**.

---

## Estrutura do repositório

```
imobiliaria-aprovar/
├── _templates/    Modelos REUTILIZÁVEIS (ponto de partida para cada cliente)
│   ├── landings/   Landing pages (HTML/CSS/JS)
│   ├── emails/     Os 6 e-mails da régua (HTML) + roteiro
│   ├── whatsapp/   Fluxo da régua de WhatsApp (JSON + descrição)
│   ├── captacao/   Lado proprietário: follow-up + prompts de laudo (AI Listings)
│   ├── copy/       Banco de copy (CSV) + ad-copy + referência
│   ├── criativos/  Storyboards, estáticos e logos
│   ├── branding/   Logos oficiais (transparentes) + kit PMax
│   └── planilha/   Planilha de gestão de tráfego e funil
├── clientes/      Material ESPECÍFICO de cada empreendimento
│   └── botanique-residence/   1º cliente (ver detalhe abaixo)
├── orquestrador/  Backend Node/Fastify COMPARTILHADO (webhooks, régua, integrações)
├── docs/          Apostila, playbooks, análises, CRO, auditoria e prompts
│   └── pdfs/      Versões em PDF dos materiais
├── setup-ids.md   IDs públicos das contas (Meta/Google/Brevo/Z-API) — segredos só no .env
└── README.md
```

**Três camadas:**
- **`_templates/`** — modelos genéricos. Nunca personalize um cliente aqui: **copie** para
  `clientes/<nome>/` e ajuste lá, mantendo os modelos limpos.
- **`clientes/<nome>/`** — tudo de um empreendimento (landings, copy, criativos, dados, mídia…).
- **`orquestrador/`** — um único backend atende todos os clientes. Deploy no Railway.

---

## Cliente: Botanique Residence

`clientes/botanique-residence/` — material de captação da **Lista VIP** do lançamento.

| Pasta | O que é |
|---|---|
| [`dados/`](clientes/botanique-residence/dados/) | **Fonte de verdade**: `empreendimento.md` (ficha) + `tabela-precos.csv` (441 lotes). Nunca inventar preço/metragem/condição/data fora daqui. |
| [`landings/cadastro-vip/`](clientes/botanique-residence/landings/cadastro-vip/) | Landing de captura VIP (`index.html`), Política (`privacidade.html`), imagens. Estática → **Netlify**. Faz POST em `/cadastro`. |
| [`emails/`](clientes/botanique-residence/emails/) | 6 e-mails da régua de nutrição (templates com placeholders) + `brevo-ready/` (versões prontas pra colar no Brevo). |
| [`criativos/`](clientes/botanique-residence/criativos/) | Estáticos, carrossel, peças PMax, roteiros de vídeo e as `fontes/` (HTML) para regerar. |
| [`copy/`](clientes/botanique-residence/copy/) | Banco de copy (CSV) por ICP/ângulo. |
| [`midia-paga/`](clientes/botanique-residence/midia-paga/) | `anuncios-copy.md`, `config-campanhas.md` (montagem Meta/Google), `plano-de-midia-botanique.md`. |
| [`whatsapp/`](clientes/botanique-residence/whatsapp/) | Régua (`regua-botanique.{md,json}`) e o design da M0 ativa + opt-in (`m0-ativa-e-optin.md`). |

**Datas do lançamento (provisórias, a confirmar com a Urba):** Fase **VIP 15/07** (cadastrados
escolhem **4 dias antes**) → **abertura geral 19/07**.

---

## O orquestrador (backend)

Node 20 + Fastify + PostgreSQL. Não derruba por credencial faltando (sobe e avisa). Resumo das rotas:

- `POST /cadastro` — lead da landing → `processarLead` (persiste + Praedium + Brevo VIP + M0 ativa + corretor).
- `GET/POST /webhook/meta-lead` — **Meta Lead Ads** (formulário nativo): handshake + assinatura
  `X-Hub-Signature-256` sobre o corpo cru, idempotência por `leadgen_id`, busca via Graph API → mesmo `processarLead` (`fonte=meta_form`).
- `POST /webhook/zapi` — **WhatsApp inbound** (Z-API): M0 + régua R1..R5b, **opt-out** (SAIR/PARAR/CANCELAR),
  escalada humana (COFECI) e priorização de lead à vista.
- `GET /` — healthcheck.

Integrações: **Z-API** (WhatsApp), **Praedium** (CRM), **Brevo** (lista/e-mail + descadastro),
**Meta CAPI** (conversões server-side), **Meta Graph** (busca do lead). Worker processa a régua a cada 60 s.
Testes: `cd orquestrador && npm test` (node:test, sem banco/rede). **Deploy:** Railway (root `orquestrador`).

---

## Conformidade (obrigatória em toda peça)

- **CRECI 9770J** sempre visível; a **Aprovar é parceira na venda** (Botanique é da Urba/Grupo MRV&CO) — nunca se passar pela incorporadora.
- **Valorização:** ❌ proibido **garantir/prometer** retorno (sem %, prazos, "valorização garantida",
  "lucro certo"). ✅ permitido **hedge factual** como expectativa ("região em expansão", "alto potencial
  de valorização"). Ônus da prova do anunciante.
- **Avisos:** "imagens meramente ilustrativas (renders)"; preços/condições "a partir de" e "sujeitos a
  alteração e disponibilidade"; "Não há promessa de valorização".
- **LGPD:** opt-in por caixa **desmarcada e obrigatória** (cobre WhatsApp + e-mail), com link da Política;
  grava `consentimento_em` e `whatsapp_optin`; opt-out por "SAIR" para a régua e reflete no Brevo.
- **COFECI 1.551/2025:** a IA se identifica como **assistente virtual da Aprovar**, mantém o CRECI visível
  e **oferece corretor humano** (escalada imediata quando pedido).

---

## Configuração & segredos

- **IDs públicos** (Meta/Google/Brevo/Z-API/Praedium) em [`setup-ids.md`](setup-ids.md).
- **Segredos** (tokens, API keys, `DATABASE_URL`) **nunca** são versionados — vivem em `.env`
  (ignorado pelo git) e, em produção, nas *Variables* do Railway. Ver [`orquestrador/.env.example`](orquestrador/.env.example).
- **Deploys:** landing(s) estáticas no **Netlify**; backend no **Railway**.

---

## Documentos úteis

- **Método/playbooks:** `docs/README_-_01_Apostila_do_metodo.md`, `docs/README_-_02_Playbook_de_midia_paga.md`,
  `docs/Biblioteca-Prompts-Execucao-AQV.md`.
- **CRO da landing:** [`docs/cro-botanique.md`](docs/cro-botanique.md) — hipóteses de conversão + plano de A/B.
- **Auditoria de qualidade:** [`docs/auditoria-qualidade-botanique.md`](docs/auditoria-qualidade-botanique.md).
- **Backend:** [`orquestrador/README.md`](orquestrador/README.md).
