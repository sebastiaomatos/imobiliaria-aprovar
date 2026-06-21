# Biblioteca de Prompts de Execução — Sistema Imóveis AQV / Aprovar

> Como usar: cada bloco é um prompt **copia-e-cola**. Os marcados com 🟦 são para rodar no **Claude Code / Cowork** (dentro da pasta do projeto, onde já estão a apostila, o playbook, o banco de copy, as landings, as réguas e a planilha). Os 🟩 são **ações na plataforma** (Meta, Google, Brevo, Railway, Praedium) — o texto serve de checklist e de prompt para um assistente te guiar passo a passo. Os 🟧 são **decisões suas**.
>
> Faça na ordem. A numeração já respeita as dependências. Não pule a Fase 1.6 (teste ponta a ponta) antes de gastar em mídia.

---

## FASE 0 — Fundação (preparar o terreno)

### 🟦 0.1 — Versionar o projeto
```
Inicialize um repositório Git nesta pasta do projeto Aprovar/AQV. Crie um .gitignore adequado (node_modules, .env, arquivos de credenciais, builds). Faça o primeiro commit com tudo que já existe (apostila, playbooks, banco de copy, landings, réguas, planilha, diagramas). Depois me mostre a estrutura de pastas em árvore e sugira uma organização de diretórios por frente: /landings, /emails, /whatsapp, /criativos, /captacao, /docs, /orquestrador.
```

### 🟧 0.2 — Abrir/organizar contas (decisão + execução manual)
Crie/confirme, nesta ordem:
- **Meta:** Business Manager → Página da Aprovar → Instagram conectado → WhatsApp Business API (via Z-API ou BSP) → Pixel/Dataset criado.
- **Google:** Conta Google Ads → propriedade GA4 → contêiner GTM.
- **TikTok:** TikTok Ads Manager (opcional na largada).
- **E-mail:** conta Brevo.
- **WhatsApp:** conta Z-API ativa e número conectado.
> Anote todos os IDs (Pixel ID, GA4 Measurement ID, GTM ID, Business ID, conta de anúncios) num só lugar — você vai colar isso na instrumentação (0.6) e nas variáveis do orquestrador (0.4).

### 🟧 0.3 — Upgrade do Praedium  ← **COMECE POR AQUI**
Decisão única que destrava todo o loop. No painel do Praedium, suba do plano **Profissional** para **Alta Performance**. Isso libera **webhooks, LeadSync e API** — pré-requisito para o orquestrador receber leads e atualizar o CRM automaticamente. Sem isso, nada da automação roda.

### 🟦 0.4 — Deploy do orquestrador no Railway
```
O orquestrador Node/Fastify já está construído e testado. Quero subir no Railway. Me guie passo a passo: (1) criar o projeto no Railway e conectar este repositório; (2) listar TODAS as variáveis de ambiente que o orquestrador espera (tokens de Z-API, Praedium, Gemini, Brevo, Pixel/CAPI, secret de webhook) com uma breve explicação de onde obter cada uma; (3) gerar um arquivo .env.example com os nomes das variáveis (sem valores); (4) configurar o start command e a porta; (5) me dar a URL pública do serviço e os endpoints (webhook de lead, healthcheck). Não exponha segredos no código.
```

### 🟩 0.5 — Domínio + hospedagem das landings
- Suba as landings em **Vercel/Netlify/Hostinger**.
- Aponte um subdomínio (ex.: `imoveis.suaimobiliariaaprovar.com.br`) via **DNS** (registro CNAME/A conforme o host).
- Confirme HTTPS ativo.

### 🟦 0.6 — Instrumentação (GTM, GA4, Pixel, CAPI)
```
Quero instrumentar as landings. O script.js já dispara os eventos certos (click_whatsapp, lead_submit, engaged_15s, conversa_iniciada, visita_agendada, venda). Me ajude a: (1) gerar o snippet do GTM para colar no <head> de cada landing; (2) configurar no GTM as tags do GA4 e do Meta Pixel disparando nos eventos do dataLayer; (3) mapear cada evento do funil para um evento padrão/custom do Pixel e do GA4; (4) montar o payload server-side da CAPI que o orquestrador envia (com event_id para deduplicação). Me entregue um checklist de QA para validar cada evento no Test Events do Meta e no DebugView do GA4.
```

### 🟦 0.7 — Conectar Z-API ↔ orquestrador ↔ Praedium
```
Quero fechar o circuito de lead. Me guie para: (1) registrar o webhook de "novo lead" das landings apontando para o endpoint do orquestrador no Railway; (2) configurar o Z-API para enviar/receber mensagens via orquestrador; (3) configurar o LeadSync/webhook do Praedium para criar/atualizar o lead quando o orquestrador chamar. Quero testar com um lead fake: descreva exatamente o fluxo esperado (landing → webhook → cria lead no Praedium → dispara M0 no WhatsApp → notifica corretor) e o que checar em cada ponta.
```

### 🟩 0.8 — Brevo (autenticação + listas)
- Autentique o domínio: configure **SPF, DKIM e DMARC** (Brevo fornece os registros DNS).
- Crie a **lista de leads** e a estrutura de automação que receberá os 6 e-mails.
- Faça um envio de teste e confira a entrega (caixa de entrada, não spam).

---

## FASE 1 — Ativos de conversão (antes de gastar com mídia)

### 🟦 1.1 — Publicar as 2 landings de imóvel
```
Quero publicar as duas landings de imóvel que já existem (Jardim Itália R$539k / AP-1042 e Pedra 90 R$219k / AP-2087). Antes de subir: revise os textos entre colchetes, confirme telefone (65) 99232-6461 e CRECI 9770J visíveis, valide que o botão de WhatsApp e o formulário apontam para o endpoint correto do orquestrador e que as UTMs estão configuradas. Me dê o checklist final de publicação por landing.
```

### 🟦 1.2 — Landing de avaliação (captação)
```
Quero a landing de "avaliação grátis" para proprietários (lado captação). Use o mesmo branding da Aprovar. Campos: endereço, contato, tipo de imóvel. Promessa: estimativa instantânea + "sem ligação, 30 segundos". CTA leva ao laudo por IA. Integre o mesmo tracking das outras landings (lead_submit) e o webhook do orquestrador, marcando a origem como "proprietário". Nunca prometa preço garantido — deixe claro que é uma estimativa.
```

### 🟦 1.3 — Importar a régua de WhatsApp
```
Importe a régua de WhatsApp do comprador para o orquestrador/builder. Sequência: M0 (0–5 min, saudação + intenção) → M1 (capacidade/FGTS) → M2 (2 horários de visita) → M3 (confirma + pausa + notifica corretor); recuperação R1 (10 min) → R5 (D15/D30). Regras: para a régua assim que o lead responder; "à vista"/alta renda = prioridade humana imediata. Me mostre o fluxo final e os pontos onde o corretor humano é notificado.
```

### 🟩 1.4 — Subir os 6 e-mails no Brevo
Monte a automação no Brevo com os 6 e-mails já escritos, nos gatilhos: **Imediato · D1 · D2 · D4 · D6 · D10**. Cada e-mail tem **um único CTA → WhatsApp**. Ative o opt-out e confirme a renderização em mobile.

### 🟦 1.5 — Follow-up do vendedor (T0–T5)
```
Configure a sequência de follow-up do vendedor (lado captação): T0 (imediato) → T1 (5 min) → T2 (D1) → T3 (D3) → T4 (D7) → T5 (D14), do laudo à reunião de captação. Classifique o lead como HOT/WARM/COLD conforme engajamento. Me mostre o fluxo e as condições de classificação e de parada.
```

### 🟦 1.6 — Teste ponta a ponta  ← **GO / NO-GO da Fase 3**
```
Vamos validar o sistema inteiro com um lead-teste real antes de qualquer mídia paga. Gere um lead pela landing e me ajude a verificar, em ordem: (1) o M0 do WhatsApp chega em segundos; (2) o lead aparece no Praedium com a UTM correta; (3) o e-mail 1 (Imediato) dispara; (4) os eventos chegam no Test Events do Meta e no DebugView do GA4; (5) o corretor é notificado nos pontos certos. Me dê um relatório de cada checagem com PASSOU/FALHOU e o que corrigir.
```

---

## FASE 2 — Criativos

### 🟧 2.1 — Gravar os 3 vídeos
Grave pelos storyboards (no celular, vertical Reels/Stories): **Tour objetivo (40s)** · **Oportunidade de preço (24s)** · **Recorte por motivação (32s)**. O imóvel é o astro, não o corretor. Use as legendas de metragem e preço dos roteiros.

### 🟦 2.2 — Adaptar o banco de 111 copies
```
Quero adaptar o banco de 111 copies aos imóveis reais e aos 4 ICPs. Pegue o CSV do banco (ICP × plataforma × tipo) e personalize as variações para os imóveis-âncora (Jardim Itália R$539k e Pedra 90 R$219k): preço, metragem, bairro, ângulo por ICP (sair do aluguel / upgrade / alto padrão / investidor). Mantenha os qualificadores que filtram o curioso. Me entregue as copies prontas organizadas por ICP e plataforma, prontas para colar no Gerenciador.
```

### 🟦 2.3 — Estáticos por ICP
```
Quero variações de criativo estático (feed e story) por ICP, no branding da Aprovar. Para cada ICP: foto do imóvel + preço/metragem em destaque + selo da Aprovar + CTA. Me dê as especificações (dimensões feed 1080x1080 e story 1080x1920, hierarquia visual, onde entra cada texto) e, se possível, gere os layouts.
```

### 🟦 2.4 — Criativos de captação
```
Crie os criativos do lado captação (proprietários): "Quanto vale o seu imóvel em 2026?" + campo de endereço sugerido + reforço "sem ligação, 30 segundos". Mesmo branding. Nunca prometa preço garantido. Me dê feed e story.
```

---

## FASE 3–4 — Aquisição (comprador) + Retargeting

### 🟩 3.1 — Meta Ads — campanha de mensagens (Click-to-WhatsApp) por ICP
Objetivo: **Conversas/Mensagens**. Destino: WhatsApp. Um conjunto por ICP. Orçamento de teste: **R$ 30–50/dia por conjunto**. Use as copies do banco (2.2) e os vídeos/estáticos. Otimize para `conversa_iniciada`.

### 🟩 3.2 — Meta Ads — Lead Ads por ICP
Objetivo: **Leads** (formulário instantâneo). Conecte ao Praedium via integração/orquestrador. Um conjunto por ICP. Mesma verba de teste.

### 🟩 3.3 — Google Search — campanhas por ICP
Campanhas de **Search** com headlines/descrições do banco. Palavras-chave por intenção (ex.: "apartamento 2 quartos Cuiabá", "imóvel MCMV Cuiabá"). Extensões com telefone e site. Conversão = `lead_submit` / `conversa_iniciada`.

### 🟩 3.4 — TikTok (opcional)
Ganchos do banco em vídeo curto vertical. Comece pequeno; só priorize depois que Meta + Google estiverem no verde.

### 🟩 4.1 — Públicos de retargeting
Crie públicos: visitantes da landing, vídeo 25/50/75%, engajamento IG/FB. Campanha de retargeting com reforço do imóvel + escassez real.

### 🟩 4.2 — BOFU + lista do CRM
Suba a base de leads frios do Praedium como **público personalizado** e rode reengajamento com prova + escassez (equivale ao R5 da régua, em mídia).

---

## FASE 5 — Captação (proprietário)

### 🟩 5.1 — Campanha de captação → landing de avaliação
Campanha (Meta/Google) para proprietários levando à landing de avaliação (1.2). Use os criativos 2.4.

### 🟦 5.2 — Ligar o laudo por IA
```
Quero ativar o laudo por IA (lado captação). Use os 6 prompts de captação (AI Listings) já criados. Conecte ao Gemini via orquestrador: ao receber um lead de proprietário, gerar um laudo amigável (faixa de valor + o que move o preço + 3 ganhos rápidos + CTA suave). Adapte do inglês para PT-BR ("home valuation" → "avaliação do seu imóvel", "você" informal). Deixe explícito que é estimativa, não avaliação formal. Me mostre o fluxo e um exemplo de laudo gerado.
```

### 🟦 5.3 — Ativar o follow-up do vendedor (T0–T5)
```
Ative a sequência de follow-up do vendedor (1.5) ligada ao laudo: do laudo à reunião de captação, classificando HOT/WARM/COLD. Confirme que os disparos e a classificação estão rodando com um lead-teste de proprietário.
```

---

## FASE 6–7 — Dados, escala e rotina

### 🟦 6.1 — Validar a CAPI / eventos
```
Quero confirmar que o loop de dados está fechado. Verifique que conversa_iniciada, visita_agendada e venda estão chegando pela CAPI (server-side, com deduplicação por event_id) e pelo CRM. Me dê um checklist de validação no Gerenciador de Eventos do Meta e um diagnóstico de qualidade da correspondência (match quality).
```

### 🟩 6.2 — Lookalikes
Crie públicos **lookalike** a partir de: compradores (evento `venda`), visitas (`visita_agendada`), conversas (`conversa_iniciada`). O de conversas forma mais rápido; o de compradores é o mais valioso (precisa de volume).

### 🟦 6.3 — Operar a planilha de gestão
```
Quero operar a planilha de gestão (abas Painel/Metas/Lançamentos/Funil). Me explique a rotina diária: lançar 1 linha por campanha/dia na aba Lançamentos; conferir o Painel (investimento, CPL, custo por conversa/visita/venda, taxas do funil, receita, ROAS, semáforo). Defina os alvos na aba Metas (CPL ~R$12, CAC <R$900, ROAS 15x+). Me dê um mini-roteiro de 5 minutos/dia.
```

### 🟧 6.4 — Regra de escala (disciplina)
- 🟢 **Verde:** aumente o orçamento **+20% a cada 3 dias**.
- 🔴 **Vermelho:** corte a verba.
- 🟡 **Amarelo:** troque o criativo antes de mexer no público.
- Nunca escale na fase de aprendizado nem com a régua de conversão incompleta.

### 🟦 7.1 — Rotina orgânica 3-3-3
```
Quero montar a rotina orgânica 3-3-3 no Instagram da Aprovar: 3 conteúdos por semana (imóvel protagonista, sempre com qualificadores), 3 conversas por dia iniciadas ativamente (comentários, DMs, indicações), 3 follow-ups por lead (24h/72h/7 dias). Me dê um calendário semanal e ideias de conteúdo por ICP.
```

### 🟦 7.2 — Newsletter + revisão semanal
```
Quero a newsletter mensal de mercado no Brevo (o que acontece no mercado de Cuiabá, novos imóveis, dicas) para nutrir compradores e proprietários frios. E quero fechar a rotina: revisão semanal de KPIs de 30 min na planilha — cortar o vermelho, escalar o verde, trocar criativos do amarelo, olhar os "dias parado" do funil. Me ajude a estruturar a newsletter e um roteiro da revisão semanal.
```

---

## Conformidade (transversal — vale para tudo)
- **Anúncios:** não prometa preço garantido nem "vendo sua casa em X dias". Exclua dos públicos quem já é lead/cliente e perfis de corretores concorrentes. Confira no Gerenciador se a conta cai em restrição de categoria de habitação e ajuste a segmentação.
- **LGPD:** colete só o necessário (nome, contato, intenção); aviso de privacidade na landing; opt-out respeitado na régua; dados no CRM com acesso restrito.
- **CRECI:** exiba o CRECI 9770J nos materiais e na landing. A régua e o laudo são **marketing e qualificação** — o ato profissional (avaliação formal, negociação, fechamento) é sempre do corretor humano. Deixe claro quando o atendimento é automático e ofereça caminho fácil para falar com uma pessoa. O laudo é estimativa, não avaliação oficial.
