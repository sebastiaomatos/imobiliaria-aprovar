# Sistema Imóveis AQV — Aprovar Negócios Imobiliários (CRECI 9770J)

Repositório do sistema de marketing e vendas da Aprovar (Cuiabá/MT): landings, e-mails, régua de WhatsApp, banco de copy, criativos, captação e o orquestrador de automação.

## Estrutura

```
aprovar-aqv/
├── landings/      Landing pages (principal + imóveis-âncora) — HTML/CSS/JS
├── emails/        Os 6 e-mails da régua (HTML) + roteiro
├── whatsapp/      Fluxo da régua de WhatsApp (JSON + descrição)
├── captacao/      Lado proprietário: follow-up do vendedor + prompts de laudo (AI Listings)
├── copy/          Banco de copy (CSV) + ad-copy + referência
├── criativos/     Storyboards dos vídeos, estáticos e logos
├── docs/          Apostila, playbooks, análises, plano de execução e biblioteca de prompts
│   └── pdfs/      Versões em PDF dos materiais
├── planilha/      Planilha de gestão de tráfego e funil (adicionar o .xlsx aqui)
└── orquestrador/  Código Node/Fastify da automação (adicionar aqui se centralizar no mesmo repo)
```

## Onde está cada coisa

- **Landings:** `landings/index.html` (principal), `landings/apartamento-jardim-italia.html` (AP-1042, R$ 539k) e `landings/apartamento-pedra-90.html` (AP-2087, R$ 219k).
- **Régua de WhatsApp:** `whatsapp/fluxo-whatsapp.json` (M0→M3 + recuperação R1→R5).
- **E-mails:** `emails/` (Imediato · D1 · D2 · D4 · D6 · D10).
- **Captação:** `captacao/seller-followup.md` (T0→T5) e `captacao/chatgpt-prompts.md` (laudo por IA).
- **Copy:** `copy/bancodecopy.csv` (111 variações: ICP × plataforma × tipo).
- **Plano de execução:** `docs/pdfs/Plano-Execucao-Imoveis-AQV-Aprovar.pdf` e a `docs/Biblioteca-Prompts-Execucao-AQV.md`.

## Próximos passos

Siga o plano de execução em `docs/`. Ordem: Fase 0 (fundação) → Fase 1 (conversão) → teste ponta a ponta → criativos → mídia → captação → dados/escala.
