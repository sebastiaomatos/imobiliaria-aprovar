# Sistema Imóveis AQV — Aprovar Negócios Imobiliários (CRECI 9770J)

Repositório de marketing e vendas da Aprovar (Cuiabá/MT), organizado em três camadas:
**modelos reutilizáveis** (`_templates/`), **material de cada cliente/empreendimento**
(`clientes/<nome>/`) e o **backend de automação compartilhado** (`orquestrador/`).

## Estrutura

```
imobiliaria-aprovar/
├── _templates/    Modelos REUTILIZÁVEIS (ponto de partida para cada cliente)
│   ├── landings/   Landing pages (HTML/CSS/JS)
│   ├── emails/     Os 6 e-mails da régua (HTML) + roteiro
│   ├── whatsapp/   Fluxo da régua de WhatsApp (JSON + descrição)
│   ├── captacao/   Lado proprietário: follow-up + prompts de laudo (AI Listings)
│   ├── copy/       Banco de copy (CSV) + ad-copy + referência
│   ├── criativos/  Storyboards, estáticos e logos
│   └── planilha/   Planilha de gestão de tráfego e funil
├── clientes/      Material ESPECÍFICO de cada empreendimento
│   └── botanique-residence/   1º cliente (landings, copy, imagens, dados, book…)
├── orquestrador/  Backend Node/Fastify COMPARTILHADO (webhooks, régua, integrações)
├── docs/          Apostila, playbooks, análises, plano de execução e prompts
│   └── pdfs/      Versões em PDF dos materiais
└── README.md
```

## Como usar

- **`_templates/`** — modelos genéricos. Não personalize um cliente aqui: **copie** o
  que precisar para `clientes/<nome>/` e ajuste lá. Assim os modelos seguem limpos.
- **`clientes/<nome>/`** — tudo de um empreendimento: landings, copy, criativos,
  `imagens/`, `dados/` (tabela de preços, ficha) e `book/` (material do corretor).
  Ex.: `clientes/botanique-residence/`.
- **`orquestrador/`** — um único backend atende todos os clientes (webhook Z-API,
  régua de recuperação, Praedium, Brevo, Meta CAPI). Deploy no Railway.
- **`docs/`** — material-fonte e playbooks (não é template nem cliente).

## Ponteiros úteis

- **Landings (modelo):** `_templates/landings/` (home + imóveis-âncora).
- **Régua de WhatsApp (modelo):** `_templates/whatsapp/fluxo-whatsapp.json`.
- **Banco de copy:** `_templates/copy/bancodecopy.csv`.
- **Cliente Botanique:** `clientes/botanique-residence/` — `dados/`, `imagens/`, `book/`.
- **Plano de execução:** `docs/pdfs/Plano-Execucao-Imoveis-AQV-Aprovar.pdf` e
  `docs/Biblioteca-Prompts-Execucao-AQV.md`.
```
