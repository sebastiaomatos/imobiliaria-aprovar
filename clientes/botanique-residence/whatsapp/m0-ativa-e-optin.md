# M0 ativa proativa + notificação ao corretor — design e execução

> Objetivo: o lead que opta-in recebe uma **primeira mensagem ativa no WhatsApp em <5 min** (M0
> ativa), e o **corretor é notificado na hora** de todo lead novo. Em conformidade LGPD + COFECI.

## 1) Decisão de conformidade (não negociável)
- **Opt-in NÃO pode ser pré-marcado** (LGPD exige consentimento inequívoco — caixa desmarcada/ato
  afirmativo; o Meta nem permite pré-marcar). Pré-marcar = consentimento inválido = M0 ativa sem base
  legal + rejeição no Meta + risco ANPD (até 2% do faturamento).
- **Estratégia válida para opt-in alto:** caixa **desmarcada e obrigatória**, redigida como benefício
  (1ª pessoa, valor, reversão de risco). Efeito prático: quase todo mundo que envia opta-in — válido.
- A M0 ativa só dispara se `whatsapp_optin === true` (consentimento específico para contato por WhatsApp).

## 2) Opt-in — copy exata (estado da arte, compliant)

### Site (landing) — caixa única, DESMARCADA, obrigatória
> Substitui/ajusta o checkbox LGPD atual. Cobre WhatsApp + e-mail. Vincula a Política.
```
☐  Sim! Autorizo a Aprovar (CRECI 9770J) a me enviar o material e falar comigo por
   WhatsApp e e-mail sobre o Botanique Residence. Sem spam — saio quando quiser.
   (ver Política de Privacidade)
```
- Botão: **"Quero entrar na lista VIP →"**. `whatsapp_optin = true` quando marcada (obrigatória → ~100% dos envios).
- Registrar `consentimento_em` (timestamp) e `fonte` (já existe).

### Formulário do Meta (Instant Form) — pergunta de consentimento value-framed
> O Meta exige a seção de consentimento desmarcada; redija como benefício.
```
Título da pergunta: Posso te chamar no WhatsApp?
Consentimento (desmarcado, obrigatório):
  "Sim, autorizo a Aprovar (CRECI 9770J) a falar comigo por WhatsApp e e-mail sobre o
   Botanique Residence. Saio quando quiser."
+ link da Política de Privacidade (obrigatório no Meta).
```
- `whatsapp_optin = true` só se marcada. Mapear no webhook (`fonte=meta_form`).

### Alavancas legítimas (use) × o que NUNCA fazer
- ✅ Valor em 1ª pessoa · reversão de risco ("sem spam, saio quando quiser") · especificidade
  (o que recebe) · fricção mínima · autoridade (CRECI) · pedir no pico de intenção (no próprio form).
- ❌ Pré-marcar · dupla negativa ("desmarque se NÃO quiser") · esconder/forçar bundling. Motivo triplo:
  invalida o consentimento, é rejeitado pelo Meta, e gera reclamação de spam que **derruba a reputação
  do número** (mata o canal).

## 3) M0 ativa — design técnico
- **Gatilho:** dentro do `processarLead` (serviço único que /cadastro e /webhook/meta-lead usam),
  DEPOIS de persistir lead + Praedium + Brevo.
- **Condição:** `whatsapp_optin === true` **e** `M0_ATIVA_ENABLED === true` (flag de segurança).
- **Envio:** Z-API send-text para o telefone do lead, com a M0 ativa (texto abaixo), personalizada (`nome`).
- **Idempotência:** flag `m0_ativa_enviada` por lead — nunca reenviar. Se o lead já tiver mandado inbound
  (régua M0 inbound já tratou), **não** enviar a ativa (coordenar pela flag, evita mensagem dupla).
- **Log + atribuição:** registrar envio, `fonte`, timestamp.
- **Opt-out:** ver seção 5.

## 4) Notificação ao corretor (sempre, independente de opt-in)
- Z-API send-text para `CORRETOR_WHATSAPP` (5565992326461) com os dados do lead + link `wa.me` para
  abrir a conversa. Assim, além da M0 automática, um humano entra rápido.
- **Texto:**
```
🔔 Novo lead VIP — Botanique
Nome: {{nome}}
WhatsApp: {{telefone}}  → abrir: https://wa.me/{{telefone}}
E-mail: {{email}}
Objetivo: {{objetivo}}
Origem: {{fonte}}
Opt-in WhatsApp: {{sim/não}} · {{consentimento_em}}
{{#optin}}A M0 automática já foi enviada.{{/optin}} Assuma quando puder.
```

## 5) M0 ativa — texto (COFECI: identifica-se, CRECI, opt-out, escalada humana)
```
Oi, {{nome}}! 👋 Aqui é a assistente virtual da *Aprovar Negócios Imobiliários* (CRECI 9770J),
parceira na venda do *Botanique Residence*. Que bom te ter na lista VIP! 🌳

Posso te enviar agora o mapa dos lotes disponíveis e as condições de lançamento (entrada de 10%,
24x sem juros)? Pra eu te ajudar melhor: você pensa em *morar*, *investir* ou *construir*?

Se preferir falar com um corretor humano, é só pedir que eu chamo. E se não quiser mais receber
mensagens, responda *SAIR* que eu paro na hora. 🙂
```

## 6) Opt-out (LGPD/COFECI)
- No `/webhook/zapi`, detectar inbound `SAIR` / `PARAR` / `CANCELAR` (case-insensitive) →
  marcar `whatsapp_optout_em`, **parar a régua**, e confirmar:
```
Pronto, não te chamo mais por aqui. Se mudar de ideia, é só me chamar. 🙂
```
- Refletir o opt-out no Brevo (descadastro) quando aplicável.

## 7) Risco operacional (honesto) e mitigação
- Z-API é gateway **não-oficial**; disparo proativo pode sinalizar o número se for frio/volume alto.
  Aqui o risco é baixo: mensagem **consentida, imediata, personalizada, baixo volume**, de número com
  histórico. Mitigar: manter o número aquecido, volume sadio, monitorar bloqueios.
- Se escalar muito, migrar a M0 ativa para a **WhatsApp Cloud API oficial com template aprovado**
  (mensagem business-initiated robusta). Manter a régua inbound como está.

---

## 8) PROMPT PARA O CLAUDE CODE
```
PAPEL: engenheiro(a) backend sênior (Node/Fastify), padrão de produção (idempotência, testes,
conformidade). Reutilize os padrões já existentes no orquestrador (processarLead, /webhook/zapi,
integração Z-API, flags por env). Estado da arte; não regredir o que existe.

CONTEXTO: já existe (ou está sendo criado) processarLead({nome, telefone, email, objetivo, fonte,
consentimento, whatsapp_optin, meta}) usado por /cadastro e /webhook/meta-lead, que persiste o lead
+ cria no Praedium + adiciona à lista VIP no Brevo. A régua M0 hoje dispara por INBOUND no
/webhook/zapi. Integração Z-API (send-text) já existe.

OBJETIVO: (A) enviar uma M0 ATIVA proativa ao lead que opta-in, logo após a criação; (B) notificar
o corretor de todo lead novo; (C) tratar opt-out.

TAREFA 1 — M0 ativa (em processarLead, após persistir + Praedium + Brevo):
- Só envia se whatsapp_optin === true E env M0_ATIVA_ENABLED === 'true' (default 'true').
- Idempotência: coluna/flag leads.m0_ativa_enviada (boolean). Se já true, NÃO reenvia.
- Coordenar com a régua inbound: se o lead já iniciou conversa (M0 inbound já tratada), marcar
  m0_ativa_enviada e NÃO enviar a ativa (evitar dupla). 
- Enviar via Z-API send-text o texto da M0 ativa (abaixo), com {{nome}}. Setar m0_ativa_enviada=true.
- Log estruturado (lead id, fonte, ok/erro) sem PII desnecessária. Tratar erro do Z-API sem quebrar
  o fluxo (retry/log).

TAREFA 2 — Notificação ao corretor (SEMPRE, independente de opt-in):
- Z-API send-text para env CORRETOR_WHATSAPP (5565992326461) com o template de notificação (abaixo),
  incluindo link https://wa.me/{{telefone}}. Idempotente por lead (não duplicar).

TAREFA 3 — Opt-out (no /webhook/zapi):
- Detectar inbound cujo texto normalizado seja SAIR/PARAR/CANCELAR → setar leads.whatsapp_optout_em,
  PARAR a régua desse lead, responder a confirmação (abaixo). Refletir descadastro no Brevo se houver
  integração. Garantir que nenhum envio futuro (régua/M0) ocorra para quem deu opt-out.

TAREFA 4 — Schema/migração: adicionar leads.m0_ativa_enviada (bool default false),
leads.whatsapp_optout_em (timestamp null). Migração idempotente.

TAREFA 5 — Env (documentar em README/.env.example; sem segredos):
  M0_ATIVA_ENABLED ('true'/'false') · CORRETOR_WHATSAPP=5565992326461 (já existe) · Z-API (já existe).

TAREFA 6 — Testes (obrigatório):
- optin=true → M0 ativa enviada 1x (idempotente em 2ª chamada).
- optin=false → NÃO envia M0, MAS notifica o corretor.
- lead com inbound prévio → não duplica M0.
- opt-out (SAIR) → marca optout, para régua, confirma; envio posterior é bloqueado.
- M0_ATIVA_ENABLED='false' → não envia ativa (mas notifica corretor).
- Rodar a suíte existente e PROVAR que /cadastro e /webhook/zapi seguem passando.

TEXTOS (usar exatamente):
- M0 ativa:
"Oi, {{nome}}! 👋 Aqui é a assistente virtual da Aprovar Negócios Imobiliários (CRECI 9770J),
parceira na venda do Botanique Residence. Que bom te ter na lista VIP! 🌳

Posso te enviar agora o mapa dos lotes disponíveis e as condições de lançamento (entrada de 10%,
24x sem juros)? Pra eu te ajudar melhor: você pensa em morar, investir ou construir?

Se preferir falar com um corretor humano, é só pedir que eu chamo. E se não quiser mais receber
mensagens, responda SAIR que eu paro na hora. 🙂"
- Notificação corretor:
"🔔 Novo lead VIP — Botanique
Nome: {{nome}}
WhatsApp: {{telefone}} → https://wa.me/{{telefone}}
E-mail: {{email}}
Objetivo: {{objetivo}}
Origem: {{fonte}}
Opt-in WhatsApp: {{optin}} · {{consentimento_em}}
Assuma quando puder."
- Confirmação opt-out:
"Pronto, não te chamo mais por aqui. Se mudar de ideia, é só me chamar. 🙂"

COMMITS (conventional) + push:
  feat(orquestrador): M0 ativa proativa (opt-in) + notificacao ao corretor
  feat(orquestrador): opt-out por SAIR no /webhook/zapi (para regua + Brevo)
  test(orquestrador): M0 ativa, notificacao e opt-out
  docs(orquestrador): flags e fluxo da M0 ativa

PARE e me avise se: a suíte existente quebrar, faltar a coluna/migração, ou o fluxo inbound da régua
conflitar com a M0 ativa de um jeito que eu precise decidir.
```

## 9) Ajuste necessário no opt-in (pré-requisito da M0 ativa)
- **Landing:** trocar o texto do checkbox LGPD pelo da seção 2 (cobre WhatsApp) — o orquestrador já
  deve gravar `whatsapp_optin`. (Pode ir no próximo passe do Claude Code na landing.)
- **Formulário do Meta:** criar a pergunta de consentimento da seção 2 ao montar a Campanha A — é de
  onde também sai a key `META_LEAD_FIELD_OBJETIVO` do webhook.
