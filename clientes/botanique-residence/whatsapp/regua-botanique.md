# Régua de WhatsApp — Botanique Residence (lançamento de lotes + lista VIP)

> Adaptação de [`_templates/whatsapp/fluxo-whatsapp.md`](../../../_templates/whatsapp/fluxo-whatsapp.md) ao **Botanique Residence** — condomínio fechado de lotes (Urba/Grupo MRV&CO), venda pela **Aprovar** (CRECI 9770J).
> **Mesma mecânica** do template: `M0` + recuperação `R1–R5`, regras de parada e eventos. Contexto: **lançamento com lista VIP** (acesso antecipado).
> Fonte dos dados: [`dados/empreendimento.md`](../dados/empreendimento.md). Substitua `{{ }}` na hora do envio.

## Variáveis do lançamento (editar só aqui)

| Variável | Valor | Uso |
|---|---|---|
| `{{ACESSO_VIP}}` | **15/07** | Início do acesso antecipado (lista VIP) — provisório |
| `{{LANCAMENTO_GERAL}}` | **19/07** | Abertura para o público geral |
| `{{LOTE_A_PARTIR}}` | **R$ 312.500** | Lote de 250 m² (faixa inicial; vai até R$ 434.200) |
| `{{ENTRADA}}` | **R$ 31.250** | Entrada de 10% no lote de 250 m² |
| `{{PARCELAS_SEM_JUROS}}` | **24x sem juros** | Saldo em até 24x, sem juros e sem correção |
| `{{PARCELA_DESDE}}` | **R$ 3.204/mês** | Parcela no **plano longo (180x)** — exemplo do lote de 250 m² |
| `{{VIDEO_URL}}` | _(TODO)_ | URL **absoluta** do vídeo/render enviado na `R1` (confirmar com a Urba/produção) |
| `{{nome}}` | (do lead) | Primeiro nome do lead |

> ⚠️ **Datas provisórias — a confirmar com a Urba** antes de disparar. Por ora: **15/07** (VIP) → **19/07** (geral).
> ⚠️ `24x sem juros` e `R$ 3.204/mês` são **planos diferentes** (saldo curto sem juros **ou** plano longo de 180x). Nunca apresentar como a mesma coisa.

## Princípios
1. **Responder em até 5 min** (idealmente automático no minuto 0). Lead de tráfego pago esfria rápido.
2. **Qualificar cedo:** objetivo (**morar / investir / construir**) + se **já é VIP** + forma de pagamento.
3. O "sim" aqui é **garantir prioridade no acesso antecipado VIP** e escolher o lote antes do público geral.
4. **Parar a régua** assim que o lead responder e um corretor humano assumir.
5. **Reativar** quem some com **escassez real** (vagas VIP limitadas) — sem prometer valorização garantida.

## Gatilho de entrada
- **Origem A:** clique no anúncio Click-to-WhatsApp do lançamento → chega com contexto.
- **Origem B:** Lead Ads / formulário "Lista VIP" da landing → dispara `M0` automaticamente.

---

## Mensagens da régua

### `M0` — Imediato (0–5 min) · saudação + qualificação + gancho VIP
> Oi, {{nome}}! 👋 Aqui é a *assistente virtual da Aprovar* (CRECI 9770J), no lançamento do *Botanique Residence* — condomínio fechado de lotes com **lago, praia e lazer completo** em Cuiabá.
> Pra eu te orientar do jeito certo: você pensa no lote pra **morar**, **investir** ou **construir**? E você **já está na lista VIP**?
> 🔑 Quem é VIP entra no **acesso antecipado em {{ACESSO_VIP}}** — antes do lançamento geral ({{LANCAMENTO_GERAL}}) — e escolhe os melhores lotes primeiro.
> Prefere falar agora com um **corretor de verdade**? É só me dizer *"corretor"* que eu chamo alguém da equipe. 🙂

➡️ Marca `intencao`/`vip` e segue para `M1`. Sem resposta em **10 min** → `R1`.
> ⚖️ **COFECI 1.551/2025:** a `M0` deixa claro que quem inicia o atendimento é uma **assistente virtual (IA)** da Aprovar, mantém o **CRECI 9770J** visível e oferece **escalada para um humano** a qualquer momento.

### `M1` — capacidade
> Show, {{nome}}! E como você pretende adquirir: **à vista**, **financiamento** ou **parcelamento direto** (entrada + parcelas)?
> Dá pra começar com **entrada de {{ENTRADA}}** e o **saldo em {{PARCELAS_SEM_JUROS}}** — *ou* um plano mais longo com **parcelas a partir de {{PARCELA_DESDE}}**.

➡️ Marca `pagamento` e segue para `M2`. Se responder **à vista** → **prioridade humana imediata** (ver regras).

### `M2` — garantir prioridade na lista VIP (o "sim")
> Perfeito. Os lotes do acesso antecipado são **limitados** e saem por ordem de cadastro. Posso **garantir sua prioridade na lista VIP** e já te mandar a planta com os lotes disponíveis?
> Prefere falar com um corretor **hoje** ou **amanhã de manhã**? 🗓️

➡️ Se aceitar → `M3` + **notifica corretor** + **pausa automação** + evento `vaga_vip_priorizada`. Sem resposta em **1 dia** → `R2`.

### `M3` — confirmação
> Combinado, {{nome}}! Te coloquei na **prioridade da lista VIP** e um corretor da Aprovar vai falar com você. Já te mando a planta e a tabela. Qualquer dúvida, é só chamar aqui. 🙌

---

## Régua de recuperação (quem não responde)

### `R1` — +10 min · diferenciais + leve urgência
> Ah, {{nome}}, deixa eu te mostrar por que o *Botanique* chama tanta atenção 👇
> 🎥 [enviar vídeo: `{{VIDEO_URL}}`]
> **Lago exclusivo** com **pier** e **faixa de areia (praia)**, **pista de cooper de 1,4 km** e **lazer completo** (piscina, pool bar, quadras, pet place e mais).
> As vagas do **acesso antecipado VIP ({{ACESSO_VIP}})** são poucas. Quer que eu **garanta a sua** antes do lançamento geral?

### `R2` — Dia 2 · condição (quebra de objeção de preço)
> {{nome}}, fiz uma conta rápida: dá pra começar com **entrada de {{ENTRADA}}** e o saldo em **{{PARCELAS_SEM_JUROS}}**, *ou* parcelas **a partir de {{PARCELA_DESDE}}** no plano longo — lote a partir de **{{LOTE_A_PARTIR}}**. 👀
> Quer que eu te mande a simulação no seu nome?

### `R3` — Dia 4 · escassez real da lista VIP
> Passando só pra avisar: o **acesso antecipado VIP** vai de **{{ACESSO_VIP}}** até o lançamento geral em **{{LANCAMENTO_GERAL}}**, e as unidades reservadas pra lista são **limitadas**.
> Se ainda fizer sentido pra você, me avisa que eu **seguro um lote no seu nome**. 🔑

### `R4` — Dia 7 · última chamada antes do geral
> {{nome}}, não quero te encher 🙂 Depois de **{{LANCAMENTO_GERAL}}** os lotes abrem pra todo mundo, e os melhores costumam ir rápido.
> Quer que eu mantenha sua **prioridade VIP** e te mande as opções no seu perfil (tamanho/quadra)?

### `R5a` — Dia 15 · reativação leve
> Oi, {{nome}}! 🌿 Lembrei de você: o **Botanique** segue evoluindo e ainda dá tempo de garantir um bom lote à beira do lago. Quer que eu te mande o vídeo e as condições atualizadas? Sem compromisso.

### `R5b` — Dia 30 · última reativação (com saída fácil)
> {{nome}}, última passada por aqui 🙂 Se ainda tiver vontade de ter um endereço perto do lago em Cuiabá, me chama que eu te atualizo do que mudou no Botanique (novas unidades e condições). Se preferir não receber mais, é só responder *"parar"*.

### `OPTOUT` — quando o lead pede para parar
> Tudo bem, {{nome}}! Não te mando mais mensagens automáticas. Quando quiser falar sobre o Botanique, é só chamar aqui. 🙏 Aprovar · CRECI 9770J.

### `ESCALADA` — quando o lead pede atendimento humano (COFECI)
> Claro, {{nome}}! 🙂 Já estou avisando um corretor da Aprovar pra te atender aqui mesmo. Em instantes ele assume a conversa. (Aprovar · CRECI 9770J)

➡️ Gatilho: `escalada_keywords` (corretor, humano, atendente, advogado, ligar…). Ação: **notifica o corretor imediatamente + pausa a automação** (o humano assume).

---

## Regras de parada e ramificação

| Condição | Ação |
|---|---|
| Lead responde qualquer mensagem | Pausa a régua automática + **notifica corretor** (humano assume) |
| Lead garante prioridade VIP (`M2`/`M3`) | CRM → "VIP priorizado" + lembrete; evento `vaga_vip_priorizada` |
| Lead diz "parar"/"sair"/"cancelar" | Envia `OPTOUT` + encerra automação (opt-out) |
| Lead pede **"corretor"/"humano"/"atendente"** | Envia `ESCALADA` + **notifica corretor na hora** + pausa automação (COFECI) |
| Lead diz **"à vista"** / sinaliza alta renda | **Prioridade alta → atendimento humano imediato** (notifica corretor agora) |
| Sem resposta após `R5` (D30) | Move para "Frio" + campanha de reengajamento (Meta BOFU) |

## Eventos (CRM / Pixel / CAPI)
- `conversa_iniciada` (`M0` respondida) → evento de **conversão** para Meta/Google (CAPI).
- `vaga_vip_priorizada` (`M2` aceita) → evento de **valor** + base de Lookalike.
- `regua_R1`…`regua_R5` → disparo de cada etapa de recuperação (auditoria).
- `optout` → descadastro.
- `venda` (fechamento no CRM) → valor máximo + Lookalike de compradores.

## Conformidade
> "Preços, condições, correções e atualizações sujeitos a alteração sem aviso prévio; unidades dependem da disponibilidade de estoque." **Não** prometer valorização garantida — usar *"alto potencial de valorização"* como expectativa.
> **COFECI 1.551/2025:** o atendimento automatizado se identifica como **assistente virtual (IA)** logo na `M0`, mantém o **CRECI** visível e oferece **escalada para um corretor humano** a qualquer momento (`ESCALADA`).
> Aprovar Negócios Imobiliários · CRECI 9770J · (65) 99232-6461.
