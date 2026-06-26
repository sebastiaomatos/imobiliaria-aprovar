# Runbook Brevo — Botanique VIP (Aprovar)

> Atualizar TUDO no Brevo: domínio autenticado -> 6 modelos (HTML pronto) -> automação (e-mails 1-3 na entrada da lista) -> campanhas agendadas (4-6). Os HTML já estão **prontos pra colar** em `clientes/botanique-residence/emails/brevo-ready/` (`IMG_BASE`, `{{contact.NOME}}`, `{{ unsubscribe }}` e datas já resolvidos). Assuntos/preheaders abaixo são paste-ready.

## 0. Pré-requisitos (uma vez)
- **Autenticar o domínio** (deliverability — NÃO pule): Brevo -> **Configurações -> Remetentes, Domínios e IPs dedicados -> Domínios** -> adicionar e **autenticar `imobiliariaaprovar.com.br`** (criar os registros **DKIM / SPF / DMARC** que o Brevo mostrar, no seu DNS).
- **Remetente:** mesma área -> **Remetentes** -> criar remetente no domínio autenticado, ex.: nome `Aprovar Imobiliária` · e-mail `vip@imobiliariaaprovar.com.br` (reply-to monitorado).
- **Lista + atributo:** **Contatos -> Listas** -> confirmar a **Lista VIP (ID 3)**. **Contatos -> Atributos** -> confirmar o atributo **`NOME`** (o orquestrador já adiciona os leads nesta lista com `NOME`). Se o atributo tiver outro nome, troque `{{contact.NOME}}` nos HTML.
- **Imagens:** os HTML puxam imagens de `https://imobiliaria-aprovar.netlify.app/email-img/` -> **confirme que a landing está publicada** (as imagens ficam em `landings/cadastro-vip/email-img/`). Se trocar o domínio da landing, mantenha o `netlify.app` no ar **ou** regere os HTML com o novo `IMG_BASE`.

## 1. Criar os 6 modelos (templates) — HTML pronto pra colar
**Como (cada um):** Brevo -> **Campanhas -> Modelos -> Novo modelo** -> nomear -> escolher o editor **"Pasta de código" (HTML)** / **"Importar HTML"** -> abrir o arquivo brevo-ready, **copiar tudo e colar** -> salvar. Defina o **Assunto** com a tabela. Personalização usa **`{{contact.NOME}}`**; descadastro **`{{ unsubscribe }}`** (nativo, já no rodapé). O **preheader já está embutido** no HTML (div escondida logo após o `<body>`) — o campo "Texto de pré-visualização" do Brevo é opcional (se quiser preencher, use a coluna preheader).

> Arquivos: `clientes/botanique-residence/emails/brevo-ready/`

| # | Nome do modelo | Arquivo (colar o HTML inteiro) | Assunto (campo "Assunto") | Preheader (opcional) |
|---|---|---|---|---|
| 1 | `bot-vip-1-boasvindas` | `email-1-boasvindas.html` | `Você está dentro, {{contact.NOME}} 🌳` | `Bem-vindo à lista VIP do Botanique — e veja por que você escolhe seu lote antes de todo mundo.` |
| 2 | `bot-vip-2-diferenciais` | `email-2-diferenciais.html` | `{{contact.NOME}}, deixa eu te mostrar o lago 🌳` | `Lago com praia particular, pier, cooper de 1,4 km e clube pronto.` |
| 3 | `bot-vip-3-financiamento` | `email-3-financiamento.html` | `Cabe no seu bolso, {{contact.NOME}} 💚` | `Entrada de 10%, 24x sem juros e um plano longo a partir de R$ 3.204/mês. Veja as condições.` |
| 4 | `bot-vip-4-acesso` | `email-4-acesso-antecipado.html` | `Chegou sua vez, {{contact.NOME}}: o acesso VIP abriu 🔑` | `Hoje você escolhe seu lote antes do público geral.` |
| 5 | `bot-vip-5-escassez` | `email-5-escassez.html` | `Os melhores lotes estão indo, {{contact.NOME}} ⏳` | `Antes de 19/07, garanta a melhor posição perto do lago.` |
| 6 | `bot-vip-6-geral` | `email-6-lancamento-geral.html` | `Botanique: a pré-venda abriu pra todos — e ainda dá tempo 🚀` | `Os lotes destaque saem rápido; vamos ver o que dá tempo no seu perfil?` |

> Dica anti-assunto-vazio: `{{contact.NOME | default : "tudo bem"}}`.

## 2. Automação — e-mails 1->3 (disparo na ENTRADA da lista VIP)
Brevo -> **Automações -> Criar uma automação -> Começar do zero** · Nome: **`bot-vip-boasvindas`**.
- **Ponto de entrada (gatilho):** **"Um contato é adicionado a uma lista"** -> **Lista VIP (ID 3)**.
- **Passo 1 — Enviar um e-mail:** modelo **`bot-vip-1-boasvindas`** (imediato).
- **Passo 2 — Atraso: 1 dia** -> **Enviar um e-mail:** `bot-vip-2-diferenciais`.
- **Passo 3 — Atraso: 1 dia** -> **Enviar um e-mail:** `bot-vip-3-financiamento`.
- **Ativar** a automação.
- ⚠️ **Corrigir a automação antiga** ("Campanha Botanic", com template genérico errado): em **Automações**, **desative/exclua** a antiga pra não duplicar disparo (ou substitua os e-mails pelos `bot-vip-*`).

## 3. Campanhas agendadas — e-mails 4->6
**Como (cada uma):** Brevo -> **Campanhas -> E-mail -> Criar uma campanha** -> **"Usar um modelo"** (o `bot-vip-*` correspondente) -> **Para / Destinatários: Lista VIP (ID 3)** -> conferir **Assunto** -> **Remetente** (o autenticado) -> **Agendar**.

| # | Modelo | Agendar para | Objetivo |
|---|---|---|---|
| 4 | `bot-vip-4-acesso` | **15/07** (ex.: 08:00) | acesso VIP abriu |
| 5 | `bot-vip-5-escassez` | **~17/07** (1-2 dias antes do geral) | escassez |
| 6 | `bot-vip-6-geral` | **19/07** | lançamento geral |

⚠️ **Datas 15/07 e 19/07 são provisórias** e estão **hardcoded nos HTML**. **Confirme com a Urba** antes de agendar; se mudarem, regere os HTML brevo-ready (reaplicando as substituições) ou ajuste à mão.

## 4. Antes de cada disparo (checklist)
- **Envio de teste** pra você -> conferir no **celular** (layout, imagens carregando, link do WhatsApp, nome preenchido).
- Imagens carregando = landing publicada (item 0). CTA = `wa.me/5565992326461`.
- Rastreamento de **aberturas/cliques** ligado (padrão Brevo).
- Rodapé já traz **CRECI 9770J**, "parceira na venda", "sem promessa de valorização" e descadastro — não remover.

## 5. Como o loop funciona (pra não duplicar)
- O **orquestrador** (cadastro da landing `/cadastro`) adiciona o lead à **Lista VIP (ID 3)** com `NOME` via API -> isso **dispara o gatilho** da automação (e-mails 1-3).
- As **campanhas 4-6** vão pra **lista inteira** nas datas fixas (independente de onde o contato está na automação). Quem entrar perto das datas pode receber automação + campanha — aceitável.
- E-mail (Brevo) e WhatsApp (Z-API) são canais **separados**: o e-mail nutre; o CTA leva pro WhatsApp. Não há webhook inbound do Brevo.

## 6. Gaps / flags
| Item | Situação |
|---|---|
| Autenticação de domínio | Fazer primeiro — é o que mais afeta entrega (inbox vs spam) |
| Imagens | Dependem do deploy da landing (host Netlify `/email-img`) |
| Datas 15/07 e 19/07 | Provisórias — confirmar com a Urba antes de agendar |
| Atributo `NOME` | Deve existir e vir preenchido (vem do orquestrador) |
| Automação antiga "Campanha Botanic" | Desativar/corrigir pra não duplicar |

## Referência
Lista VIP **ID 3** · Atributo **NOME** · Remetente no domínio **imobiliariaaprovar.com.br** · IMG_BASE `https://imobiliaria-aprovar.netlify.app/email-img` · WhatsApp `wa.me/5565992326461` · CRECI 9770J · VIP 15/07 · Geral 19/07. Arquivos HTML: `clientes/botanique-residence/emails/brevo-ready/`.
