# E-mails — Botanique Residence (nutrição da lista VIP)

Cadência que nutre o cadastrado VIP até o lançamento, com **storytelling crescente** (sonho → diferenciais → condições → acesso → escassez → lançamento). Cada e-mail tem **um único CTA: WhatsApp** (`wa.me/5565992326461`). Branding Aprovar (#F57F17 / #004310): **logo hospedada no header** (`{{IMG_BASE}}/logo-aprovar.png`), rodapé com CRECI 9770J e aviso legal. Base: [`_templates/emails`](../../../_templates/emails) · dados em [`../dados/empreendimento.md`](../dados/empreendimento.md) · imagens em [`../imagens`](../imagens).

| # | Disparo | Assunto + (preheader) | Objetivo | Arquivo |
|---|---|---|---|---|
| 1 | Imediato (automático na entrada) | **Você está dentro, {{nome}} 🌳** — _Bem-vindo à lista VIP do Botanique — e por que você escolhe seu lote antes de todo mundo._ | Boas-vindas + prioridade VIP | `email-1-boasvindas.html` |
| 2 | D1 | **{{nome}}, deixa eu te mostrar o lago 🌳** — _Lago com praia particular, pier, cooper de 1,4 km e clube pronto._ | Diferenciais com storytelling | `email-2-diferenciais.html` |
| 3 | ~D+2 (automação) | **Cabe no seu bolso, {{nome}} 💚** — _Entrada de 10%, 24x sem juros e um plano longo a partir de R$ 3.204/mês. Veja as condições._ | Condições / financiamento | `email-3-financiamento.html` |
| 4 | {{ACESSO_VIP}} (15/07) | **Chegou sua vez, {{nome}}: o acesso VIP abriu 🔑** — _Hoje você escolhe seu lote antes do público geral._ | Escolha do lote antes do geral | `email-4-acesso-antecipado.html` |
| 5 | 1–2 dias antes do geral | **Os melhores lotes estão indo, {{nome}} ⏳** — _Antes de {{LANCAMENTO_GERAL}}, garanta a melhor posição perto do lago._ | Escassez — garanta o seu | `email-5-escassez.html` |
| 6 | {{LANCAMENTO_GERAL}} (19/07) | **Botanique: a pré-venda abriu pra todos — e ainda dá tempo 🚀** — _Os lotes destaque saem rápido; vamos ver o que dá tempo no seu perfil?_ | Últimas oportunidades da pré-venda | `email-6-lancamento-geral.html` |

> Os assuntos/preheaders acima são versões A. Vale testar uma versão B mais curta (ex.: e-mail 6 "Abriu pra todos 🚀"). Cada e-mail já traz o assunto sugerido no comentário HTML do topo.

## Placeholders editáveis
- `{{nome}}` — primeiro nome do lead.
- `{{ACESSO_VIP}}` = **15/07** (provisório) · `{{LANCAMENTO_GERAL}}` = **19/07** (⚠️ confirmar datas com a Urba antes de disparar).
- `{{IMG_BASE}}` — **host absoluto das imagens** (ex.: `https://cdn.suaimobiliariaaprovar.com.br/botanique`). ⚠️ **TODO:** subir as imagens de [`../imagens`](../imagens) para um host público e definir esta base no Brevo. Clientes de e-mail **não** abrem caminhos relativos.
- `{{UNSUB}}` — link de descadastro (no Brevo, usar a merge tag de unsubscribe).

## Ao enviar (importante)
- Todas as imagens usam `{{IMG_BASE}}/arquivo.jpg`. Antes de disparar, **defina `{{IMG_BASE}}` com a URL absoluta hospedada** (ver placeholder acima).
- Conformidade: preços/condições/disponibilidade sujeitos a alteração; sem promessa de valorização (usar "alto potencial de valorização"). `24x sem juros` (saldo curto) e `R$ 3.204/mês` (plano 180x) são planos **diferentes** — nunca apresentar como o mesmo (o e-mail 3 os mantém distintos: "24x sem juros **ou** plano longo").
- Design responsivo: chrome em tabela de 600px, `<style>` com media query para mobile; header com a **logo Aprovar** hospedada (`{{IMG_BASE}}/logo-aprovar.png`).
