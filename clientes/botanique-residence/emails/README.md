# E-mails — Botanique Residence (nutrição da lista VIP)

Cadência que nutre o cadastrado VIP até o lançamento. Cada e-mail tem **um único CTA: WhatsApp** (`wa.me/5565992326461`). Branding Aprovar (#F57F17 / #004310), rodapé com CRECI 9770J e aviso legal. Base: [`_templates/emails`](../../../_templates/emails) · dados em [`../dados/empreendimento.md`](../dados/empreendimento.md) · imagens em [`../imagens`](../imagens).

| # | Disparo | Assunto | Objetivo | Arquivo |
|---|---|---|---|---|
| 1 | Imediato | Você está na lista VIP do Botanique 🌿 | Boas-vindas + próximos passos | `email-1-boasvindas-vip.html` |
| 2 | D1 | Por que o Botanique é diferente 🌳 | Lago, praia, pista de cooper e lazer (renders) | `email-2-diferenciais.html` |
| 3 | D2 | As condições de lançamento 💳 | Entrada 10%, 24x sem juros, planos longos | `email-3-condicoes.html` |
| 4 | {{ACESSO_VIP}} (12/07) | Chegou sua vez: acesso antecipado aberto 🔑 | Escolha do lote antes do geral | `email-4-acesso-antecipado.html` |
| 5 | 1–2 dias antes do geral | Os melhores lotes estão saindo ⏳ | Escassez — garanta o seu | `email-5-escassez.html` |
| 6 | {{LANCAMENTO_GERAL}} (19/07) | Lançamento geral no ar 🚀 | Últimas oportunidades da pré-venda | `email-6-lancamento-geral.html` |

## Placeholders editáveis
- `{{nome}}` — primeiro nome do lead.
- `{{ACESSO_VIP}}` = **12/07** · `{{LANCAMENTO_GERAL}}` = **19/07** (⚠️ confirmar datas com a Urba antes de disparar).
- `{{UNSUB}}` — link de descadastro (no Brevo, usar a merge tag de unsubscribe).

## Ao enviar (importante)
- As imagens estão referenciadas como `../imagens/...` (para preview local). **Antes de disparar, troque por URLs absolutas hospedadas** — clientes de e-mail não abrem caminhos relativos.
- Conformidade: preços/condições/disponibilidade sujeitos a alteração; sem promessa de valorização (usar "alto potencial de valorização"). `24x sem juros` (saldo curto) e `R$ 3.204/mês` (plano 180x) são planos **diferentes** — nunca apresentar como o mesmo.
