# Playbook de Técnicas de Venda — Imóveis AQV / Aprovar

> **O que é:** a enciclopédia acionável de copy, persuasão e venda do método **Imóveis AQV**
> ("Anúncios que Vendem"). Cada técnica vem **operacionalizada** — definição curta, quando usar,
> passo a passo, **um exemplo trabalhado no Botanique Residence**, checklist e swipe pronto. É a
> referência que o orquestrador [`docs/Biblioteca-Prompts-Execucao-AQV.md`](../../docs/Biblioteca-Prompts-Execucao-AQV.md)
> invoca sob demanda. **Não duplica** os ativos do repo — aponta para eles.
>
> **Padrão de prova:** se um nome aparece aqui, ele vem com **(c) procedimento + (d) exemplo
> Botanique**. Citar autor sem regra aplicável é proibido neste documento.

---

## Índice

- [0. Como usar (encaixe no método + guardrails)](#0-como-usar-encaixe-no-método--guardrails)
- [1. Schwartz — consciência, sofisticação, tipos de lead](#1-schwartz--consciência-sofisticação-tipos-de-lead)
- [2. Estrutura de copy — Sugarman · Hopkins · Caples · Ogilvy](#2-estrutura-de-copy--sugarman--hopkins--caples--ogilvy)
- [3. Gatilhos — Cialdini · Kahneman · ancoragem · posse · future pacing · open loops](#3-gatilhos--cialdini--kahneman--ancoragem--posse--future-pacing--open-loops)
- [4. Oferta — Hormozi (equação de valor, reversão, bônus, escassez real)](#4-oferta--hormozi-equação-de-valor-reversão-bônus-escassez-real)
- [5. Conversa de alto ticket — SPIN · Sandler · Chris Voss](#5-conversa-de-alto-ticket--spin--sandler--chris-voss)
- [6. Objeções — as 7 do repo expandidas para lote/condomínio](#6-objeções--as-7-do-repo-expandidas-para-lotecondomínio)
- [7. Fechamento ético](#7-fechamento-ético)
- [8. Speed-to-lead — por que < 5 min](#8-speed-to-lead--por-que--5-min)
- [9. Product Launch Formula (Jeff Walker) aplicada ao Botanique](#9-product-launch-formula-jeff-walker-aplicada-ao-botanique)
- [10. Métricas — KPIs, benchmarks e diagnóstico de gargalo](#10-métricas--kpis-benchmarks-e-diagnóstico-de-gargalo)
- [11. Folha de diagnóstico (1 página)](#11-folha-de-diagnóstico-1-página)
- [Fontes / bibliografia](#fontes--bibliografia)

**Legenda de ícones:** 🟦 rodar no Claude Code/Cowork · 🟩 ação em plataforma · 🟧 decisão sua · ✅ permitido · ❌ proibido · ⚠️ conformidade.

---

## 0. Como usar (encaixe no método + guardrails)

### 0.1 Onde este playbook entra
O método AQV é **Marketing de Intenção, não de Atenção**: anúncios que filtram o curioso e atraem o comprador real (ver [`docs/analise.md`](../../docs/analise.md) e [`docs/README_-_01_Apostila_do_metodo.md`](../../docs/README_-_01_Apostila_do_metodo.md)). Este playbook é a camada de **técnica fina** por baixo de cada ativo já existente:

| Etapa do funil | Ativo do repo | Seções deste playbook que se aplicam |
|---|---|---|
| Anúncio (Meta/Google) | [`midia-paga/anuncios-copy.md`](../../clientes/botanique-residence/midia-paga/anuncios-copy.md), [`_templates/copy/bancodecopy.csv`](../copy/bancodecopy.csv) | 1 (consciência), 2 (headline), 3 (gatilhos) |
| Landing | [`landings/cadastro-vip/index.html`](../../clientes/botanique-residence/landings/cadastro-vip/index.html), [`docs/cro-botanique.md`](../../docs/cro-botanique.md) | 2 (slippery slide), 3, 4 (oferta) |
| Lead → M0 WhatsApp | [`whatsapp/regua-botanique.md`](../../clientes/botanique-residence/whatsapp/regua-botanique.md), [`whatsapp/m0-ativa-e-optin.md`](../../clientes/botanique-residence/whatsapp/m0-ativa-e-optin.md) | 5 (SPIN/Sandler/Voss), 8 (speed-to-lead) |
| Régua R1–R5 + e-mails | régua acima + [`_templates/emails/emails.md`](../emails/emails.md) | 3 (open loops/future pacing), 6 (objeções), 7 (fechamento) |
| Lançamento | [`midia-paga/plano-de-midia-botanique.md`](../../clientes/botanique-residence/midia-paga/plano-de-midia-botanique.md) | 9 (PLF) |
| Gestão | [`docs/README_-_06_Planilha_de_gestao_de_trafego_e_funil.md`](../../docs/README_-_06_Planilha_de_gestao_de_trafego_e_funil.md) | 10 (métricas) |

> O método já usa, sem nomear formalmente, vários frameworks (bookend, inimigo comum, mecanismo único nomeado, ancoragem em cascata, empilhamento de bônus, escassez/reversão duplas, future pacing, escolha binária) — catalogados em [`docs/analise.md` §5](../../docs/analise.md). Este playbook **nomeia, ordena e expande** esse repertório.

### 0.2 Fonte de verdade (não inventar)
Todo número, preço, metragem, condição e amenidade sai **exclusivamente** de:
- [`clientes/botanique-residence/dados/empreendimento.md`](../../clientes/botanique-residence/dados/empreendimento.md)
- [`clientes/botanique-residence/dados/tabela-precos.csv`](../../clientes/botanique-residence/dados/tabela-precos.csv) (441 lotes)

**Dados-âncora do Botanique** (usados nos exemplos deste playbook):

| Dado | Valor (fonte: `empreendimento.md`) |
|---|---|
| Produto | Condomínio fechado de **lotes**, Cuiabá/MT |
| Loteadora / nós | Urba (Grupo MRV&CO) / **Aprovar — parceira na venda — CRECI 9770J** |
| Lotes | **441** lotes · **17 quadras** · **250 a 347 m²** |
| Preço | **a partir de R$ 312.500** (lote 250 m²); faixa até ~R$ 434.200 |
| Entrada | **10% ou 15%** |
| Pagamento | **24x sem juros** (saldo) **ou** parcelamento longo **até 180x direto com a construtora** (a partir de **R$ 3.204/mês** no lote de 250 m²) |
| Lazer | **31 itens** (lago com pier, faixa de areia/praia, piscina+pool bar, pista de cooper 1,4 km, quadras…) |
| Região | Coxipó — perto da UFMT e do Shopping 3 Américas, **região em expansão** |
| Lançamento | **Fase VIP 15/07** (4 dias antes) → **geral 19/07** *(conferir data oficial na ficha)* |
| Contato | WhatsApp (65) 99232-6461 · `wa.me/5565992326461` |
| Marca | Laranja `#F57F17` · Verde-floresta `#004310` · WhatsApp `#25D366` |

### 0.3 Guardrails de conformidade (valem para TODA peça)
⚠️ Detalhe completo em [`README.md` §Conformidade](../../README.md) e [`regua-botanique.md` §COFECI](../../clientes/botanique-residence/whatsapp/regua-botanique.md). Resumo inegociável:

- **CRECI 9770J** visível em toda peça (anúncio, landing, e-mail, WhatsApp).
- **Aprovar = imobiliária parceira na venda.** Nunca se passar pela Urba/MRV&CO.
- ❌ **Nunca garantir/prometer valorização ou retorno** (sem %, prazos, "valorização garantida", "lucro certo"). ✅ Hedge factual: "**alto potencial de valorização**", "**região em expansão**", "**tende a valorizar com a entrega da infraestrutura**".
- ✅ Avisos: "imagens ilustrativas (render)", "a partir de", "preços/condições sujeitos a alteração e disponibilidade".
- **LGPD:** opt-in por **caixa desmarcada e obrigatória**, link de Política, gravar `consentimento_em`/`whatsapp_optin`; opt-out por **SAIR** para a régua.
- **COFECI 1.551/2025:** a IA se identifica como **assistente virtual da Aprovar**, oferece **escalada para corretor humano**; avaliação/negociação/fechamento são sempre ato do corretor.

> **Regra de ouro de copy ética AQV:** toda escassez/urgência usada precisa ser **real e verificável** (data do lançamento, estoque, condição de tabela). Escassez inventada queima a marca e fere o COFECI.

---

## 1. Schwartz — consciência, sofisticação, tipos de lead

> Base: Eugene Schwartz, *Breakthrough Advertising* (1966). O motor de toda a seleção de ângulo/copy do método. Mapeia **onde a cabeça do prospecto está** antes de escolher a mensagem.

### 1.1 Os 5 estágios de CONSCIÊNCIA

**(a) Definição.** O quanto o prospecto já sabe sobre o problema, a solução e o seu produto. Quanto **mais consciente**, mais direto (e mais para o "produto/preço") pode ser o anúncio; quanto **menos consciente**, mais a copy precisa começar pelo desejo/problema.

**(b) Quando usar.** Antes de escrever **qualquer** headline ou criativo: decide o "ponto de entrada" da mensagem. É o primeiro campo da [folha de diagnóstico](#11-folha-de-diagnóstico-1-página).

**(c) Procedimento.**
1. Identifique o público da peça (tráfego frio? lista VIP? retargeting?).
2. Classifique o estágio (tabela abaixo).
3. Escolha o **lead da copy** correspondente.
4. Escreva a 1ª frase **nesse** nível — não acima.

**(d) Exemplo trabalhado — Botanique.**

| Estágio | Cabeça do prospecto | Público Botanique | Lead da copy (1ª linha) |
|---|---|---|---|
| **1. Inconsciente** | Nem sabe que tem o problema | Tráfego frio amplo (Advantage+) | *"Cuiabá tem um condomínio com praia particular e quase ninguém sabe."* |
| **2. Consciente do problema** | Sente a dor, não conhece a solução | Família apertada / investidor com dinheiro parado | *"Dinheiro parado perde para a inflação. Terra bem localizada, não."* |
| **3. Consciente da solução** | Quer "lote em condomínio fechado", não conhece o SEU | Quem já pesquisa lote em Cuiabá | *"Lote em condomínio fechado com lago e praia em Cuiabá — a partir de R$ 312.500."* |
| **4. Consciente do produto** | Conhece o Botanique, está em dúvida | Visitou a landing / engajou (retargeting) | *"Você viu o Botanique. A lista VIP escolhe os lotes 4 dias antes — ainda dá tempo."* |
| **5. O mais consciente** | Só falta o empurrão/condição | Lista VIP cadastrada | *"Sua prioridade VIP está reservada. Quer que eu te mande o mapa de lotes agora?"* (= M0 da [régua](../../clientes/botanique-residence/whatsapp/regua-botanique.md)) |

**(e) Checklist.**
- [ ] Identifiquei o estágio ANTES da headline?
- [ ] A 1ª frase entra no nível certo (não fala de preço para inconsciente; não "vende natureza" para o mais consciente)?
- [ ] Retargeting/VIP tratados como estágio 4–5 (produto/condição), não como frio?

**(f) Swipe.** Use as 4 colunas acima como banco de "primeiras linhas" por público — alimenta o campo `Texto primário` do [`copy-botanique.csv`](../../clientes/botanique-residence/copy/copy-botanique.csv).

---

### 1.2 Os 5 estágios de SOFISTICAÇÃO de mercado

**(a) Definição.** O quanto o **mercado já ouviu** promessas parecidas. Quanto mais saturado, mais a copy precisa de **mecanismo** (o "como funciona" único) e não só de promessa.

**(b) Quando usar.** Ao definir o **grande argumento** da campanha e ao diferenciar da concorrência (ex.: Kátia Cruz / outros lançamentos de Cuiabá).

**(c) Procedimento.**
1. Liste o que os concorrentes diretos já prometem.
2. Diagnostique o estágio do mercado (tabela).
3. Suba um degrau: se todos prometem o mesmo, mude para **mecanismo**; se todos têm mecanismo, vá para **identificação/experiência**.

**(d) Exemplo trabalhado — diagnóstico Cuiabá/lotes.**

| Estágio | O que o mercado já viu | Movimento do Botanique |
|---|---|---|
| 1. Promessa simples | "Lote em Cuiabá" | (saturado — não usar isolado) |
| 2. Promessa ampliada | "Lote em **condomínio fechado**" | (saturado) |
| 3. **Mecanismo** | "Condomínio **com lago, praia e clube de 31 itens**" | ✅ ângulo principal hoje — diferencial concreto e verificável |
| 4. Mecanismo ampliado | "Praia particular + pier + pôr do sol + pista de cooper 1,4 km, **entregue equipado**" | ✅ reforço/escalonamento dentro do estágio 3 |
| 5. Identificação | "**O endereço de quem vive de frente pro lago em Cuiabá**" (estilo de vida/status) | usar no retargeting/VIP (público mais consciente) |

**(e) Checklist.**
- [ ] Minha promessa central já está "gasta" na praça? Se sim, virei mecanismo?
- [ ] O mecanismo é **real e verificável** (consta em `empreendimento.md`)?
- [ ] Não prometi valorização para "subir o degrau" (⚠️ proibido)?

**(f) Swipe — escada de sofisticação Botanique.** Promessa → *"lote em condomínio"* · Mecanismo → *"com lago, praia e clube de 31 itens"* · Mecanismo+ → *"praia particular, pier e pista de 1,4 km, áreas entregues equipadas"* · Identificação → *"viver de frente pro lago"*.

---

### 1.3 Os 6 tipos de lead (aberturas de copy)

**(a) Definição.** Seis formas de abrir um anúncio/peça, do mais direto ao mais indireto. Schwartz: o tipo de lead deve casar com o estágio de consciência (1.1).

**(b) Quando usar.** Na hora de redigir a abertura — escolha o tipo pelo estágio do público.

**(c) Procedimento.** Pegue o estágio (1.1) → escolha o tipo de lead compatível → escreva.

**(d) Exemplo trabalhado — Botanique (um lead de cada tipo).**

| # | Tipo de lead | Casa com estágio | Abertura Botanique |
|---|---|---|---|
| 1 | **Oferta** (direto) | 4–5 | *"Lote de 250 m² no Botanique: R$ 312.500, entrada de 10%, 24x sem juros."* |
| 2 | **Promessa** | 3–4 | *"Tenha praia, lago e clube a poucos passos da sua casa, em Cuiabá."* |
| 3 | **Problema-solução** | 2–3 | *"Dinheiro parado perde para a inflação. Um lote bem localizado, não."* |
| 4 | **Big idea / proclamação** | 1–2 | *"Cuiabá ganhou um condomínio com praia particular — e a lista VIP abre agora."* |
| 5 | **Prova/credibilidade** | 2–3 | *"Projeto assinado por Jhonny Rother, validado por pesquisa BRAIN: conheça o Botanique."* |
| 6 | **História/identificação** | 1–2 | *"Tem domingo de tarde que a gente queria que não acabasse. No Botanique, ele é em casa."* |

**(e) Checklist.**
- [ ] O tipo de lead casa com o estágio de consciência do público?
- [ ] Frio → tipos 3–6; quente/VIP → tipos 1–2?

**(f) Swipe.** Os 6 acima → distribua no [`copy-botanique.csv`](../../clientes/botanique-residence/copy/copy-botanique.csv) como variações de `Título (headline)` por ICP.

---

### 1.4 Canalizar o desejo de massa

**(a) Definição.** A copy **não cria** desejo — ela **canaliza** um desejo que já existe em massa para o seu produto. Você "monta no" desejo (sair do aluguel, proteger patrimônio, dar segurança à família) e o aponta para o Botanique.

**(b) Quando usar.** Ao escolher o **ICP/motivação** de cada conjunto (alinha com os 3 ICPs do [plano de mídia](../../clientes/botanique-residence/midia-paga/plano-de-midia-botanique.md): Família/Morar, Investidor, Construir).

**(c) Procedimento.**
1. Nomeie o desejo de massa pré-existente do ICP.
2. Não argumente o desejo (ele já existe) — **prove que o Botanique é o melhor canal** dele.
3. Conecte o desejo ao mecanismo (1.2).

**(d) Exemplo trabalhado.**

| ICP | Desejo de massa pré-existente | Canalização para o Botanique |
|---|---|---|
| Família/Morar | Segurança + tempo de qualidade com os filhos | "Condomínio fechado com praia e clube: o quintal vira clube; o domingo, férias." |
| Investidor | Proteger patrimônio da inflação | "Terra bem localizada em região em expansão = patrimônio real, no seu nome." |
| Construir | Liberdade de fazer do seu jeito | "Lotes de 250–347 m² para erguer a casa exatamente como você imagina." |

**(e) Checklist.**
- [ ] Identifiquei um desejo que **já existe** (não tentei "ensinar" o cliente a querer)?
- [ ] Mostrei o Botanique como **canal**, não como a origem do desejo?

**(f) Swipe.** "Você já quer [DESEJO]. O Botanique é o caminho mais direto para isso porque [MECANISMO real]."

---

## 2. Estrutura de copy — Sugarman · Hopkins · Caples · Ogilvy

### 2.1 Sugarman — slippery slide, 1ª frase e gatilhos

**(a) Definição.** Joseph Sugarman (*The Adweek Copywriting Handbook*): cada elemento da copy existe para fazer ler o próximo. O **único objetivo da 1ª frase é fazer ler a 2ª** (e assim por diante) — o "slippery slide" (escorregador).

**(b) Quando usar.** Em landing, e-mail e texto primário de anúncio — qualquer peça de leitura sequencial.

**(c) Procedimento.**
1. Abra com uma frase **curta** e intrigante (ambiente + open loop).
2. Cada parágrafo entrega uma micro-recompensa e abre a próxima.
3. Use "sementes de curiosidade" ("mas tem um detalhe…", "e foi aí que…").
4. Remova qualquer frase que não empurre para a próxima.

**(d) Exemplo trabalhado — abertura da landing Botanique.**
> *"Tem um lugar em Cuiabá onde o domingo tem cara de férias.* (1ª frase = escorrega)
> *Não é resort, não é praia de outra cidade — é onde você vai morar.* (quebra padrão)
> *Um condomínio fechado de lotes, com lago, praia particular e um clube de 31 itens já no projeto.* (mecanismo)
> *E a lista VIP escolhe os lotes 4 dias antes de todo mundo…"* (open loop → CTA)

**(e) Checklist.**
- [ ] A 1ª frase é curta e dá vontade de ler a 2ª?
- [ ] Cada parágrafo abre o próximo (testei lendo só as primeiras linhas)?
- [ ] Cortei toda frase "morta"?

**(f) Swipe — 1ªs frases escorregadias.** "Tem um detalhe no Botanique que muda a conta…" · "A maioria descobre tarde demais que os melhores lotes saem primeiro." · "Antes de você ver o preço, preciso te mostrar uma coisa."

---

### 2.2 Hopkins — reason-why e especificidade

**(a) Definição.** Claude Hopkins (*Scientific Advertising*, 1923): toda afirmação precisa de um **motivo** ("reason-why") e o **específico vende mais que o genérico**. Números concretos > adjetivos.

**(b) Quando usar.** Em qualquer claim — preço, condição, diferencial. Especialmente no ângulo Investidor.

**(c) Procedimento.**
1. Para cada afirmação, pergunte "**por quê?**" e inclua o motivo.
2. Troque adjetivos por **números/fatos** da fonte de verdade.
3. Ancore upside em **fatos**, nunca em promessa (⚠️ valorização).

**(d) Exemplo trabalhado.**
- Genérico: *"Ótima localização e grande potencial."*
- Hopkins (reason-why + específico): *"No Coxipó, perto da UFMT e do Shopping 3 Américas — região em expansão. Por isso um lote aqui tende a valorizar **com a entrega da infraestrutura** (não é promessa, é a lógica de oferta/demanda da região)."*
- Genérico: *"Condições facilitadas."* → Específico: *"Entrada de 10% (R$ 31.250 no lote de 250 m²) e saldo em 24x sem juros — ou até 180x direto com a construtora, a partir de R$ 3.204/mês."*

**(e) Checklist.**
- [ ] Cada claim tem um "por quê"?
- [ ] Troquei adjetivos por números da `tabela-precos.csv`/`empreendimento.md`?
- [ ] O upside está em fato + hedge, nunca em promessa?

**(f) Swipe.** "[Afirmação], porque [motivo verificável]. Em números: [dado específico]."

---

### 2.3 Caples — headlines testadas

**(a) Definição.** John Caples (*Tested Advertising Methods*): a **headline carrega 80% do resultado**; venda o **benefício** (auto-interesse) e, quando possível, **teste**. As que mais performam: benefício direto, notícia, curiosidade ancorada e "como".

**(b) Quando usar.** Em todo título de anúncio, assunto de e-mail e H1 de landing.

**(c) Procedimento.**
1. Escreva **10+** headlines por peça (volume gera o vencedor).
2. Classifique cada uma nas 4 famílias (benefício / notícia / curiosidade / como).
3. Garanta **auto-interesse** (o que o leitor ganha) na maioria.
4. Teste 2–3 em A/B (Meta) e mate as perdedoras (ver [§10](#10-métricas--kpis-benchmarks-e-diagnóstico-de-gargalo)).

**(d) Exemplo trabalhado — 1 de cada família (Botanique).**
- **Benefício direto:** *"Sua casa a poucos passos de um lago, em Cuiabá."*
- **Notícia:** *"Abriu a lista VIP do Botanique Residence — escolha antes da abertura geral."*
- **Curiosidade ancorada:** *"O condomínio com praia particular que Cuiabá ainda não viu."*
- **Como:** *"Como garantir o lote de frente pro lago antes de todo mundo."*

**(e) Checklist.**
- [ ] Escrevi 10+ e escolhi por critério, não por gosto?
- [ ] A vencedora tem auto-interesse claro?
- [ ] Coloquei 2–3 em teste real?

**(f) Swipe.** Ver [biblioteca de fórmulas em §2.5](#25-biblioteca-de-fórmulas-de-headline--10-aberturas-para-lotecondomínio).

---

### 2.4 Ogilvy — clareza e prova

**(a) Definição.** David Ogilvy: "**não é criativo se não vende**". Clareza acima de esperteza; **prova** (fatos, autoridade, especificidade) sustenta a promessa. "O consumidor não é idiota; é sua esposa."

**(b) Quando usar.** Na revisão final de qualquer peça e na construção de **autoridade** (seção "procedência" da landing).

**(c) Procedimento.**
1. Leia em voz alta: se confunde, reescreva.
2. Adicione **prova** a cada promessa (autoria, validação, números).
3. Remova jargão e "espertezas" que não vendem.

**(d) Exemplo trabalhado — bloco de prova Botanique.**
> *"Projeto com assinatura arquitetônica de **Jhonny Rother** e paisagismo de **Eduardo Lara**, validado por **pesquisa BRAIN**. Loteadora **Urba (Grupo MRV&CO)**. Venda pela **Aprovar — CRECI 9770J**, +10 anos em Cuiabá e centenas de famílias atendidas."*

**(e) Checklist.**
- [ ] Um estranho entende em 5 segundos?
- [ ] Toda promessa tem prova ao lado?
- [ ] CRECI 9770J + papel da Aprovar (parceira) presentes?

**(f) Swipe.** "[Promessa]. Prova: [autoridade] + [número] + [validação de terceiro]."

---

### 2.5 Biblioteca de fórmulas de headline + 10 aberturas para lote/condomínio

**Fórmulas (preencher com dado da fonte de verdade):**

| Fórmula | Modelo | Exemplo Botanique |
|---|---|---|
| Benefício + lugar | "[Benefício] em [cidade/bairro]" | "Praia e lago particular em Cuiabá" |
| Específico + preço | "[Produto] de [tamanho]: [preço], [condição]" | "Lote de 250 m²: R$ 312.500, entrada de 10%" |
| Problema → solução | "[Dor]. [Solução]." | "Dinheiro parado perde. Terra, não." |
| Curiosidade ancorada | "O [categoria] que [cidade] ainda não viu" | "O condomínio com praia que Cuiabá ainda não viu" |
| Notícia/lançamento | "Abriu [evento] — [vantagem/prazo]" | "Abriu a lista VIP — escolha 4 dias antes" |
| Como (sem esforço) | "Como [resultado] sem [dor]" | "Como garantir o lote de frente pro lago sem disputa" |
| Escolha/identidade | "Para quem [identidade]" | "Para quem quer viver de frente pro lago" |
| Escassez real | "[Vantagem] só até [data/limite real]" | "Prioridade de escolha só na fase VIP (15/07)" |

**10 aberturas prontas para lote/condomínio (Botanique):**
1. *"Tem um lugar em Cuiabá onde o domingo tem cara de férias."*
2. *"Dinheiro parado perde para a inflação. Terra bem localizada, não."*
3. *"Imagina o pôr do sol no pier, e a sua casa a poucos passos dali."*
4. *"Os primeiros sempre escolhem os melhores lotes. A lista VIP existe pra isso."*
5. *"Cuiabá ganhou um condomínio com praia particular — e quase ninguém sabe ainda."*
6. *"Lote de 250 m² a partir de R$ 312.500, entrada de 10% e 24x sem juros."*
7. *"Cansou de adaptar a casa ao terreno? Aqui você faz do seu jeito (250–347 m²)."*
8. *"31 itens de lazer, lago, praia e pista de cooper de 1,4 km — já no projeto."*
9. *"Antes da abertura geral (19/07), a lista VIP escolhe primeiro (15/07)."*
10. *"Patrimônio real, no seu nome, em uma das regiões que mais crescem em Cuiabá."*

> Estas alimentam diretamente o campo `Título`/`Texto primário` do [`copy-botanique.csv`](../../clientes/botanique-residence/copy/copy-botanique.csv) e os títulos RSA do Google em [`anuncios-copy.md`](../../clientes/botanique-residence/midia-paga/anuncios-copy.md).

---

## 3. Gatilhos — Cialdini · Kahneman · ancoragem · posse · future pacing · open loops

### 3.1 Cialdini — os 7 princípios

**(a) Definição.** Robert Cialdini (*Influence*; *Pre-Suasion*): 7 atalhos de decisão — **Reciprocidade, Compromisso/Coerência, Prova Social, Autoridade, Afinidade, Escassez, Unidade**.

**(b) Quando usar.** Como checklist de "quais gatilhos esta peça aciona" — idealmente 2–3 por peça, nunca todos empilhados sem nexo.

**(c) Procedimento.** Para a peça, marque quais princípios estão presentes e **insira o que falta** com elemento real.

**(d) Exemplo trabalhado — cada princípio no Botanique.**

| Princípio | Aplicação real Botanique |
|---|---|
| **Reciprocidade** | Entregar o **mapa de lotes + condições** de graça no WhatsApp antes de pedir a visita (M0/M2 da régua). |
| **Compromisso/Coerência** | Micro-sim: "você quer **morar, investir ou construir**?" (M0) — pequeno "sim" que puxa o próximo. |
| **Prova social** | "Centenas de famílias atendidas pela Aprovar"; depoimentos; "lotes saindo rápido na fase VIP" (se real). |
| **Autoridade** | Jhonny Rother + Eduardo Lara + pesquisa BRAIN + Urba/MRV&CO + CRECI 9770J. |
| **Afinidade** | Tom local cuiabano, "de frente pro lago aqui em Cuiabá", assistente que se apresenta como Aprovar. |
| **Escassez** | Janela VIP real (15/07) + estoque limitado de lotes de frente pro lago (⚠️ só se verdadeiro). |
| **Unidade** | "Quem é da lista VIP escolhe antes" — pertencimento ao grupo de prioridade. |

**(e) Checklist.**
- [ ] A peça aciona 2–3 princípios (não 0, não 7 empilhados)?
- [ ] Escassez/prova social são **reais** (⚠️)?

**(f) Swipe.** M0 da régua já combina Reciprocidade (mapa grátis) + Compromisso (micro-pergunta) + Autoridade (CRECI). Reutilize esse trio como padrão.

---

### 3.2 Kahneman — aversão à perda e enquadramento

**(a) Definição.** Daniel Kahneman & Amos Tversky (Prospect Theory, 1979; *Thinking, Fast and Slow*): **perder dói ~2x mais do que ganhar agrada**. O **enquadramento** (ganho vs. perda) muda a decisão com o mesmo fato.

**(b) Quando usar.** No fechamento da fase VIP/lançamento e na quebra de objeção "vou pensar"/"vou ver depois".

**(c) Procedimento.**
1. Reescreva o benefício como **perda evitável** (sem mentir).
2. Foque na **janela** (o que se perde ao adiar), não só no que se ganha.
3. Combine com escassez real (3.1).

**(d) Exemplo trabalhado.**
- Enquadramento de ganho: *"Entrando na lista VIP você escolhe primeiro."*
- Enquadramento de **perda** (mais forte): *"Quem entra no dia 19 escolhe **o que sobrou** da fase VIP. A escolha de frente pro lago é dos primeiros."*
- Aplicado ao "vou pensar": *"Pensar é justo. Só lembrando que a prioridade de escolha é da fase VIP (15/07) — depois dela, os lotes de frente pro lago tendem a já estar reservados."*

**(e) Checklist.**
- [ ] Mostrei o que se **perde ao adiar** (real, sem fabricar)?
- [ ] A perda está ligada a uma janela verificável?

**(f) Swipe.** "Entrar hoje é gratuito; recuperar essa janela de escolha depois, não tem como." (já usado na landing).

---

### 3.3 Ancoragem e contraste

**(a) Definição.** A primeira referência numérica "ancora" a percepção das seguintes. Contraste = colocar a opção desejada ao lado de uma referência que a faz parecer pequena/óbvia.

**(b) Quando usar.** Em preço, parcela e comparação aluguel/investimento.

**(c) Procedimento.**
1. Apresente primeiro a **âncora alta** (valor total / custo de oportunidade).
2. Em seguida, a **parcela** ou condição VIP.
3. Contraste com referência do cotidiano do ICP (aluguel, poupança).

**(d) Exemplo trabalhado.**
- **Âncora total → parcela:** *"Um lote de R$ 312.500… que cabe em parcelas a partir de R$ 3.204/mês (até 180x direto com a construtora)."*
- **Contraste investidor:** *"Enquanto a poupança mal acompanha a inflação, um lote bem posicionado tende a valorizar com a infraestrutura."* (⚠️ hedge)
- **Contraste família:** *"R$ 3.204/mês por um terreno seu, em condomínio com praia — compare com o aluguel que não volta."*
- **Contraste VIP vs. pós:** *"Na fase VIP você escolhe entre 441 lotes; depois, entre o que sobrou."*

**(e) Checklist.**
- [ ] A âncora alta vem **antes** da parcela?
- [ ] O contraste usa referência real do ICP?
- [ ] Comparação com investimento mantém hedge (⚠️)?

**(f) Swipe.** "[Valor total alto]… que cabe em [parcela baixa]. Compare com [referência do cotidiano que não gera patrimônio]."

---

### 3.4 Efeito de posse (endowment)

**(a) Definição.** As pessoas valorizam mais aquilo que **já sentem como seu**. Fazer o prospecto "experimentar a posse" mentalmente aumenta o valor percebido e a aversão a perder.

**(b) Quando usar.** Na visita, no envio do mapa de lotes e na linguagem possessiva da copy.

**(c) Procedimento.**
1. Use possessivos: "**seu** lote", "**sua** vista", "**seu** clube".
2. Faça o prospecto **escolher/reservar** algo cedo (mapa de lotes, "qual quadra te chamou?").
3. Refira-se ao lote escolhido pelo identificador (quadra/lote) como se já fosse dele.

**(d) Exemplo trabalhado — M2 da régua.**
> *"Te mando o mapa: dá uma olhada e me diz **qual lote ficou na sua cabeça**. Eu já deixo ele marcado como sua prioridade VIP enquanto a gente conversa."*

**(e) Checklist.**
- [ ] Usei linguagem possessiva ("seu/sua")?
- [ ] Provoquei uma micro-escolha/reserva cedo?

**(f) Swipe.** "Qual deles você já consegue se imaginar morando? Deixo marcado como seu enquanto vemos as condições."

---

### 3.5 Future pacing

**(a) Definição.** Levar o prospecto a **viver mentalmente o futuro** depois da compra — sensorial e concreto. Reduz a abstração e aumenta o desejo.

**(b) Quando usar.** Em criativos de estilo de vida (ICP Família), e-mail 2/4 e abertura de landing.

**(c) Procedimento.**
1. Escolha **uma cena** concreta (não uma lista).
2. Descreva com sentidos (luz, som, pessoas).
3. Ancore num momento recorrente ("toda sexta…", "no domingo…").

**(d) Exemplo trabalhado.**
> *"Imagina a sexta-feira: você sai do trabalho, passa na portaria, e em 5 minutos as crianças já estão na faixa de areia. O pôr do sol bate no lago, o pier enche de gente da vizinhança — e a sua casa é a poucos passos dali."*

**(e) Checklist.**
- [ ] É **uma** cena concreta (não bullet list)?
- [ ] Tem sentidos e um momento recorrente?
- [ ] Usa só amenidades reais (`empreendimento.md`)?

**(f) Swipe.** "Imagina [dia da semana]: [cena sensorial com amenidade real] — e isso é a sua rotina, não as férias."

---

### 3.6 Open loops (assuntos de e-mail e ganchos)

**(a) Definição.** Abrir uma "alça" de curiosidade que só fecha se a pessoa **continuar** (abrir o e-mail, ver o vídeo até o fim). O cérebro odeia loop aberto.

**(b) Quando usar.** Em assuntos de e-mail, ganchos de TikTok/Reels e primeiras linhas.

**(c) Procedimento.**
1. Prometa uma informação específica e **adie** a entrega.
2. Não entregue tudo no assunto/gancho.
3. Garanta que o conteúdo **paga** o loop (senão queima confiança — Ogilvy).

**(d) Exemplo trabalhado — alinhado à sequência de e-mails do repo.**

| E-mail (repo) | Assunto real | Loop que abre |
|---|---|---|
| 1 boas-vindas | *"Recebi seu interesse — próximos passos"* | "quais próximos passos?" |
| 5 escassez | *"A condição da entrada termina sexta"* | "termina quando/como exatamente?" |
| Botanique (novo) | *"O lote de frente pro lago que quase ninguém viu ainda"* | "qual? por quê?" |

Gancho de Reels/TikTok: *"Espera ver a faixa de areia lá no fim do vídeo 👀"* (open loop de retenção, já no [`copy-botanique.csv`](../../clientes/botanique-residence/copy/copy-botanique.csv)).

**(e) Checklist.**
- [ ] O assunto/gancho **adia** algo específico (não é vago)?
- [ ] O conteúdo cumpre a promessa do loop?

**(f) Swipe.** "O [detalhe] do Botanique que muda a conta — te mostro lá dentro." · "Tem um lote que some primeiro todo lançamento. Te explico qual."

---

## 4. Oferta — Hormozi (equação de valor, reversão, bônus, escassez real)

### 4.1 Equação de valor

**(a) Definição.** Alex Hormozi (*$100M Offers*): **Valor = (Resultado Sonhado × Probabilidade de Sucesso) ÷ (Tempo de Atraso × Esforço/Sacrifício)**. Para aumentar valor: suba o numerador, **derrube o denominador**.

**(b) Quando usar.** Ao desenhar a oferta da landing/VIP e ao responder "tá caro".

**(c) Procedimento.**
1. Escreva os 4 termos para o seu ICP.
2. Para cada termo, liste alavancas concretas (o que aumenta resultado/probabilidade, o que reduz tempo/esforço).
3. Reescreva a oferta destacando as alavancas do denominador (atraso/esforço) — é onde o lote costuma "perder".

**(d) Exemplo trabalhado — oferta VIP Botanique (ICP Família).**

| Termo | Estado | Alavanca aplicada |
|---|---|---|
| **Resultado sonhado** | Morar em condomínio com lago/praia/clube | Reforçar a cena (future pacing) + 31 itens entregues equipados |
| **Probabilidade de sucesso** ↑ | "Será que consigo pagar/aprovar?" | Entrada 10%, **24x sem juros**, até **180x direto com a construtora** → reduz medo financeiro; Aprovar +10 anos faz a ponte |
| **Tempo de atraso** ↓ | Lançamento futuro | **Prioridade de escolha VIP (15/07)** e mapa de lotes **na hora** no WhatsApp |
| **Esforço/sacrifício** ↓ | Burocracia, disputa por lote | "Cadastro em 30s", corretor faz o processo, lote marcado como prioridade enquanto decide |

Oferta enxuta resultante: *"Entre na lista VIP (grátis, 30s) → receba o mapa de lotes no WhatsApp na hora → escolha de frente pro lago 4 dias antes de todo mundo → entrada de 10% e até 180x direto com a construtora."*

**(e) Checklist.**
- [ ] Ataquei o **denominador** (atraso/esforço), não só a promessa?
- [ ] Cada alavanca é real (`empreendimento.md`)?

**(f) Swipe.** "Você quer [resultado]. A gente encurta o caminho: [reduz atraso] e [reduz esforço], com [prova de probabilidade]."

---

### 4.2 Reversão de risco

**(a) Definição.** Transferir o risco do comprador para o vendedor reduz a barreira de decisão. Em lote, o risco percebido é **"e se eu me arrepender / e se não for o que parece"**.

**(b) Quando usar.** No CTA da landing e na quebra de objeção "vou pensar".

**(c) Procedimento.**
1. Liste os riscos percebidos do ICP.
2. Para cada um, ofereça uma **garantia real e cumprível** (não inventar prazo/condição que a Urba não dá).
3. Use garantias de **processo** (não de valorização — ⚠️ proibido).

**(d) Exemplo trabalhado.**
- Risco "vou me comprometer sem ver" → *"Entrar na lista VIP é **gratuito e sem compromisso de compra**. Você recebe o mapa e decide depois."*
- Risco "não vai ser como nos renders" → *"Imagens ilustrativas, mas você pode **visitar o stand/decorado e o masterplan** antes de qualquer assinatura."*
- Risco financeiro → *"A Aprovar (+10 anos, CRECI 9770J) acompanha **toda a documentação** com você."*

**(e) Checklist.**
- [ ] As garantias são **cumpríveis** pela Aprovar/Urba?
- [ ] Nenhuma garantia toca em valorização/retorno (⚠️)?

**(f) Swipe.** "Sem compromisso de compra: você entra grátis, recebe o mapa e só avança se fizer sentido."

---

### 4.3 Empilhamento de bônus (value stacking)

**(a) Definição.** Somar entregáveis percebidos como valiosos **à mesma decisão**, fazendo o "sim" parecer um negócio desproporcional. No imóvel, bônus = **acesso, informação e condição**, não brinde.

**(b) Quando usar.** Na oferta VIP e na mensagem M2 (garantir prioridade).

**(c) Procedimento.**
1. Liste tudo que o VIP recebe além do lote.
2. Empilhe na ordem **acesso → informação → condição → atendimento**.
3. Some num "tudo isso" antes do CTA.

**(d) Exemplo trabalhado — stack VIP Botanique.**
> *"Na lista VIP você recebe: ✅ **prioridade de escolha** 4 dias antes (15/07) · ✅ **mapa de lotes** completo no WhatsApp · ✅ **condições de lançamento** (entrada 10%, 24x sem juros, até 180x) · ✅ **corretor dedicado** da Aprovar pra fazer todo o processo. Tudo isso sem compromisso de compra."*

**(e) Checklist.**
- [ ] Cada item do stack é real e entregável?
- [ ] O stack precede o CTA?

**(f) Swipe.** "Tudo isso: [acesso] + [informação] + [condição] + [atendimento] — sem custo e sem compromisso."

---

### 4.4 Escassez e urgência REAIS

**(a) Definição.** Escassez = pouca oferta (estoque/lote). Urgência = pouco tempo (janela/data). Só funcionam — e só são permitidas (⚠️ COFECI) — quando **verdadeiras**.

**(b) Quando usar.** Em R3/R4 da régua, e-mail 5, retargeting e fechamento.

**(c) Procedimento.**
1. Use apenas escassez/urgência **documentada** (data de fase, estoque informado pela Urba).
2. Nomeie o número/data exatos.
3. Combine com aversão à perda (3.2), nunca com promessa.

**(d) Exemplo trabalhado.**
- Urgência (data real): *"A prioridade de escolha é da fase VIP — **15/07**, 4 dias antes da abertura geral (19/07)."*
- Escassez (estoque real, se confirmado): *"Os lotes de frente pro lago são poucos dentro dos 441 — e costumam sair primeiro."*
- ❌ Proibido: *"Últimas 3 unidades!"* sem que seja verdade; *"vai valorizar 30%"*.

**(e) Checklist.**
- [ ] Consigo **provar** a escassez/urgência se questionado?
- [ ] Data/estoque batem com a fonte de verdade?

**(f) Swipe.** "Prioridade de escolha só na fase VIP ([data]). Depois dela, [perda real]."

---

## 5. Conversa de alto ticket — SPIN · Sandler · Chris Voss

> Estes scripts vivem dentro da [régua de WhatsApp](../../clientes/botanique-residence/whatsapp/regua-botanique.md) (M0–M3, R1–R5) e do gerador de scripts em [`_templates/captacao/chatgpt-prompts.md`](../captacao/chatgpt-prompts.md) §4. Aqui está a técnica fina por trás de cada mensagem.

### 5.1 SPIN — perguntas de Implicação e Need-payoff

**(a) Definição.** Neil Rackham (*SPIN Selling*): em venda de alto valor, **perguntar** vende mais que falar. Sequência: **S**ituação → **P**roblema → **I**mplicação → **N**eed-payoff (ganho da solução). As duas últimas são as que mais movem.

**(b) Quando usar.** No WhatsApp (M0–M2) e na visita, para o prospecto **se convencer sozinho**.

**(c) Procedimento.**
1. **Situação** (1 pergunta, leve): contexto. Não exagere — chato.
2. **Problema:** revele a dor latente.
3. **Implicação:** amplie o custo de não resolver.
4. **Need-payoff:** faça-o verbalizar o ganho da solução.

**(d) Exemplo trabalhado — WhatsApp Botanique.**
- **S:** *"Você pensa no lote pra **morar, investir ou construir**?"* (= M0 da régua)
- **P:** *"Hoje o que mais te incomoda — falta de espaço/segurança pras crianças, ou ver o dinheiro parado perdendo pra inflação?"*
- **I (Implicação):** *"E se a fase VIP passar e os lotes de frente pro lago já estiverem reservados, faria diferença pra você ou tanto faz a posição?"*
- **N (Need-payoff):** *"Se eu garantir sua prioridade de escolha agora e te mandar o mapa, isso já te ajuda a decidir com calma antes de todo mundo, certo?"*

**(e) Checklist.**
- [ ] Fiz mais **Implicação/Need-payoff** do que Situação?
- [ ] O prospecto **verbalizou** o ganho (não fui eu)?

**(f) Swipe — banco de Implicação/Need-payoff.**
- Implicação: *"Se o lote ideal sair primeiro, o que muda no seu plano?"*
- Need-payoff: *"Se eu travar sua prioridade hoje, resolve esse receio de perder o melhor lote?"*

---

### 5.2 Sandler — contrato up-front e funil de dor

**(a) Definição.** David Sandler: estabeleça **regras claras no começo** (up-front contract) e qualifique pela **dor real** antes de apresentar. Tira a pressão e evita "vou pensar" no fim.

**(b) Quando usar.** Ao iniciar a conversa séria (pós-M1) e ao marcar a visita.

**(c) Procedimento.**
1. **Up-front contract:** combine objetivo, tempo e o que acontece no fim ("se fizer sentido, a gente avança; se não, sem problema").
2. **Funil de dor:** aprofunde a dor em 3 níveis (superfície → impacto → pessoal).
3. Só apresente depois da dor clara.

**(d) Exemplo trabalhado.**
- **Up-front (marcar visita):** *"Posso te ligar 10 min amanhã às 18h? A ideia é só entender o que você procura e te mostrar o mapa. Se fizer sentido, a gente agenda a visita; se não, sem problema nenhum — combinado?"*
- **Funil de dor:** *"Você falou em investir — hoje seu dinheiro tá em quê?"* → *"E isso tem te deixado tranquilo ou incomodado com a inflação?"* → *"O que você queria que estivesse diferente daqui a 2 anos?"*

**(e) Checklist.**
- [ ] Combinei objetivo + tempo + "saída sem problema" no começo?
- [ ] Cheguei na dor **pessoal**, não só na superfície?

**(f) Swipe.** "Combinado assim: [objetivo] em [tempo]; no fim, se fizer sentido a gente avança, se não, tudo certo. Pode ser?"

---

### 5.3 Chris Voss — rótulos, perguntas calibradas, empatia tática, accusation audit

**(a) Definição.** Chris Voss (*Never Split the Difference*): negociação por **empatia tática** — nomear emoções (**rótulos**), fazer **perguntas calibradas** ("como/o quê"), antecipar objeções (**accusation audit**) e buscar o "**isso mesmo**".

**(b) Quando usar.** Em objeções, silêncios e prospect "frio" no WhatsApp.

**(c) Procedimento.**
1. **Accusation audit:** diga você mesmo a objeção antes do cliente ("você deve estar achando que…").
2. **Rótulo:** nomeie a emoção ("parece que ficou com receio de se comprometer cedo demais").
3. **Pergunta calibrada:** "como/o quê" para ele resolver ("o que precisaria fazer sentido pra você avançar?").
4. Busque o **"isso mesmo"** (concordância real), não o "tem razão" (educado e vazio).

**(d) Exemplo trabalhado — lead sumiu após o preço.**
- **Accusation audit:** *"Imagino que você possa ter achado o valor alto, ou que seja cedo pra decidir."*
- **Rótulo:** *"Parece que você quer ter certeza antes de se comprometer — o que é justíssimo."*
- **Pergunta calibrada:** *"O que precisaria estar claro pra você se sentir seguro pra dar o próximo passo?"*
- Alvo: cliente responde *"isso mesmo, eu só queria entender as parcelas"* → caminho aberto.

**(e) Checklist.**
- [ ] Falei a objeção **antes** dele (accusation audit)?
- [ ] Usei "como/o quê" (não "por quê", que soa acusatório)?
- [ ] Busquei "isso mesmo", não rendição educada?

**(f) Swipe.** "Você deve estar pensando que [objeção]. Faz todo sentido. **O que** precisaria mudar pra isso deixar de ser um problema?"

---

## 6. Objeções — as 7 do repo expandidas para lote/condomínio

> Origem no repo: o gerador de scripts de objeção ([`_templates/captacao/chatgpt-prompts.md`](../captacao/chatgpt-prompts.md) §4) e a quebra de objeção de **preço** em **R2** da [régua](../../clientes/botanique-residence/whatsapp/regua-botanique.md). Abaixo, as **7 objeções** de comprador expandidas para lote/condomínio, no formato **Objeção | Reframe | Resposta exata**. Técnicas combinadas: Voss (5.3), Kahneman (3.2), Hormozi (4).

| # | Objeção | Reframe (como pensar) | Resposta exata (swipe WhatsApp) |
|---|---|---|---|
| 1 | **"Tá caro"** | Preço sem contexto de parcela/valor; ancorar (3.3) e quebrar em parcela (R2) | *"Entendo. Olhando o total assusta — mas o lote de 250 m² sai a partir de **R$ 3.204/mês** (até 180x direto com a construtora), entrada de 10%. Comparado ao aluguel que não volta, como fica pra você?"* |
| 2 | **"Vou pensar"** | Quase sempre = dúvida não dita; rotular (Voss) + janela (Kahneman) | *"Pensar é justo 🙂. Só pra eu te ajudar melhor: o que ainda está em aberto — é a parcela, a localização ou a posição do lote? (E lembrando: a escolha de frente pro lago é da fase VIP, 15/07.)"* |
| 3 | **"Preciso falar com meu cônjuge"** | Não furar — incluir o cônjuge e marcar próximo passo (Sandler) | *"Perfeito, decisão de casa se decide a dois 👍. Quer que eu mande um resumo com mapa e condições pra vocês verem juntos? Posso reservar sua prioridade VIP enquanto isso, sem compromisso."* |
| 4 | **"Já tenho corretor / falei com outra imobiliária"** | Não competir, agregar; reforçar autoridade Aprovar | *"Mais gente te ajudando é ótimo. A Aprovar é parceira oficial na venda do Botanique (CRECI 9770J, +10 anos em Cuiabá) — posso te garantir a prioridade VIP e o mapa atualizado direto da tabela. Sem custo pra você."* |
| 5 | **"Não sei se consigo financiamento/pagar"** | Reduzir esforço/medo (Hormozi denominador); processo guiado | *"Essa é a parte que a gente resolve junto. Tem entrada de 10%, 24x sem juros e o parcelamento direto com a construtora (até 180x) — sem depender de banco. Quer que eu simule pro lote que você curtiu?"* |
| 6 | **"Não é a hora / mês que vem eu vejo"** | Janela real da fase VIP (escassez/urgência reais) | *"Faz sentido. Só que a vantagem de escolher primeiro é só na fase VIP (15/07). Entrar agora é grátis e sem compromisso — você só garante a prioridade e decide com calma. Topa?"* |
| 7 | **"Vou ver depois / me manda que eu olho"** | Compromisso leve + próximo passo concreto (não deixar em aberto) | *"Combinado! Te mando agora o mapa e as condições. Posso te chamar amanhã às 18h só pra saber qual lote te chamou mais a atenção? 2 minutos."* |

**(e) Checklist de objeção (para qualquer uma).**
- [ ] Validei a emoção antes de rebater (Voss)?
- [ ] Devolvi com **pergunta calibrada** + próximo passo concreto?
- [ ] Usei só dados reais e hedge de valorização (⚠️)?
- [ ] Mantive porta aberta (nunca pressão que fira COFECI/LGPD)?

**(f) Swipe — estrutura universal.** "[Validação] + [reframe com 1 dado real] + [pergunta calibrada/próximo passo]."

---

## 7. Fechamento ético

**(a) Definição.** Conduzir à decisão **sem manipulação**: o fechamento honesto apenas facilita o "sim" de quem já quer, com base em vantagem real (prioridade VIP, condição de tabela). Nada de falsa escassez.

**(b) Quando usar.** Após dor clara (Sandler) e objeções tratadas (§6) — em M2/M3 e na visita.

**(c) Procedimento + (d) exemplos Botanique.**

| Técnica | Quando | Resposta exata (swipe) |
|---|---|---|
| **Fechamento por alternativa** | Marcar visita/escolha | *"Prefere visitar **sábado de manhã ou domingo à tarde**?"* / *"Te chamo **hoje 18h ou amanhã 9h**?"* |
| **Fechamento assuntivo** | Lead quente | *"Vou já deixar **seu lote** marcado como prioridade VIP e te mando o passo a passo, ok?"* |
| **Fechamento por resumo** | Pós-objeções | *"Então: lote de frente pro lago, entrada de 10%, até 180x, prioridade de escolha na fase VIP. Fechamos sua reserva de prioridade?"* |
| **Fechamento por urgência real** | Perto da data VIP | *"A prioridade de escolha vale até 15/07. Garanto a sua agora pra você não escolher só o que sobrar?"* |
| **Takeaway (tirar de cena)** | Lead empurrando com a barriga | *"Sem problema — se não for o momento, a gente se fala no lançamento geral. Só lembrando que aí a escolha é entre o que restou da fase VIP."* |

**(e) Checklist.**
- [ ] Há vantagem **real** que justifica fechar agora?
- [ ] Ofereci caminho (alternativa) em vez de "sim/não"?
- [ ] Zero falsa escassez / zero promessa de valorização (⚠️)?

**(f) Swipe universal.** "[Resumo do que ele ganha] + [alternativa de próximo passo] + [vantagem real de agir agora]."

---

## 8. Speed-to-lead — por que < 5 min

**(a) Definição.** A velocidade da **1ª resposta** ao lead é o maior multiplicador de conversão do funil. O método já fixa isso: M0 automático em **0–5 min** ([régua](../../clientes/botanique-residence/whatsapp/regua-botanique.md), [`m0-ativa-e-optin.md`](../../clientes/botanique-residence/whatsapp/m0-ativa-e-optin.md)) e SLA de **< 5 min** no [plano de mídia](../../clientes/botanique-residence/midia-paga/plano-de-midia-botanique.md).

**(b) Quando usar.** Sempre. É infraestrutura, não tática: o orquestrador dispara M0 ativa ao receber o lead (Meta Lead Ads / formulário / CTWA).

**(c) Procedimento.**
1. M0 **automático** no minuto 0 (assistente Aprovar se identifica + micro-pergunta).
2. Corretor humano notificado via `wa.me/{{telefone}}` para assumir rápido.
3. R1 em +10 min se não responder; nunca deixar lead esfriar sem toque.
4. Medir **tempo de 1ª resposta** como KPI (não só CPL).

**(d) Exemplo trabalhado — evidência aplicada.** A pesquisa de referência (Lead Response Management / HBR, ver [Fontes](#fontes--bibliografia)) indica que contatar um lead **em até 5 min vs. 30 min** aumenta enormemente a chance de qualificá-lo (ordens de grandeza), e que a chance despenca após a 1ª hora. No Botanique, lead de tráfego pago (Meta/Google) tem intenção **quente e perecível**: por isso M0 é automático e a notificação ao corretor é imediata. Traduzindo: **R$/lead** só vira **R$/conversa** e **visita** se a resposta for quase instantânea.

**(e) Checklist.**
- [ ] M0 dispara automaticamente no minuto 0?
- [ ] Corretor é notificado na hora (link wa.me)?
- [ ] Mede-se **tempo de 1ª resposta** na planilha?
- [ ] R1 cobre o no-show de resposta em +10 min?

**(f) Swipe — M0 (consistente com `m0-ativa-e-optin.md`).** *"Oi, {{nome}}! 👋 Aqui é a assistente virtual da Aprovar (CRECI 9770J), parceira na venda do Botanique Residence. Posso te mandar agora o mapa de lotes e as condições? Pra te ajudar melhor: você pensa em morar, investir ou construir?"*

---

## 9. Product Launch Formula (Jeff Walker) aplicada ao Botanique

**(a) Definição.** Jeff Walker (*Launch*): vender em **evento de lançamento** com sequência que constrói antecipação. Núcleo: **PPPL** (Pré-Pré-Lançamento → Pré-Lançamento → Lançamento → Pós) e as **3 PLCs** (Product Launch Contents): Oportunidade → Transformação → Propriedade/Oferta.

**(b) Quando usar.** É o esqueleto da fase de captação VIP → fase VIP → geral do Botanique (espelha as 3 fases do [plano de mídia](../../clientes/botanique-residence/midia-paga/plano-de-midia-botanique.md)).

**(c) Procedimento (mapeado ao Botanique).**

| Fase PLF | Fase Botanique | Objetivo | Conteúdo (PLC) |
|---|---|---|---|
| **Pré-pré-lançamento** | Captação VIP (até ~14/07) | Despertar interesse, montar lista | "Cuiabá vai ganhar um condomínio com praia particular" (curiosidade/Oportunidade) |
| **Pré-lançamento (3 PLCs)** | Aquecimento da lista VIP | Educar + desejo + superar objeções | **PLC1 Oportunidade:** o conceito (lago/praia/clube). **PLC2 Transformação:** estilo de vida + condições (entrada/parcelas). **PLC3 Propriedade:** mapa de lotes + prioridade VIP + prova (autoridade) |
| **Lançamento (carrinho)** | **Fase VIP 15/07 → geral 19/07** | Abrir escolha; converter | Oferta + escassez/urgência reais + reversão de risco |
| **Pós-lançamento** | Após 19/07 | Recuperar indecisos, vender estoque | Reativação (R5), "o que sobrou da fase VIP", próximos lotes |

**(d) Exemplo trabalhado — esqueleto de sequência (e-mail + WhatsApp), reaproveitando os ativos do repo.**

| Dia | E-mail (base [`emails.md`](../emails/emails.md)) | WhatsApp (base [`regua-botanique.md`](../../clientes/botanique-residence/whatsapp/regua-botanique.md)) | PLC |
|---|---|---|---|
| D0 (cadastro) | E1 boas-vindas → ponte WhatsApp | **M0** (mapa + micro-pergunta) | abre PPPL |
| D1 | E2 prova/autoridade (Jhonny Rother, BRAIN, Urba) | M1 capacidade | PLC1 Oportunidade |
| D2 | E3 condições/financiamento | R2 (condição: 10% + 24x/180x) | PLC2 Transformação |
| D4 | E4 "separei este lote pensando em você" | M2 prioridade VIP + mapa | PLC3 Propriedade |
| ~10–14/07 | aquecimento "falta pouco pra fase VIP" | R3 escassez real (estoque/janela) | abre carrinho |
| **15/07** | "Fase VIP aberta — escolha agora" | M2/M3 fechar escolha | **Lançamento** |
| 19/07 | "Abertura geral — últimos da fase VIP" | R4 última chamada | carrinho |
| D+pós | E6 reativação / 3 opções novas | R5a/R5b reativação | Pós |

**(e) Checklist.**
- [ ] Tenho as 3 PLCs (Oportunidade/Transformação/Propriedade) antes de abrir a escolha?
- [ ] A "abertura de carrinho" coincide com data real (15/07)?
- [ ] O pós-lançamento recupera indecisos (R5/E6)?
- [ ] Toda antecipação é honesta (sem escassez fabricada — ⚠️)?

**(f) Swipe — gatilho de abertura VIP.** *"Chegou o dia: a lista VIP do Botanique pode escolher os lotes a partir de hoje (15/07), 4 dias antes da abertura geral. Quer que eu te mande o mapa atualizado pra você marcar o seu?"*

---

## 10. Métricas — KPIs, benchmarks e diagnóstico de gargalo

**(a) Definição.** O funil só melhora pelo que se mede. KPIs e semáforos do método estão em [`docs/README_-_06_Planilha_de_gestao_de_trafego_e_funil.md`](../../docs/README_-_06_Planilha_de_gestao_de_trafego_e_funil.md) e no [plano de mídia](../../clientes/botanique-residence/midia-paga/plano-de-midia-botanique.md).

**(b) Quando usar.** Diário nos primeiros 3 dias de cada campanha; depois 2–3x/semana.

**(c) Procedimento (diagnóstico de gargalo, etapa a etapa).**
1. Meça cada etapa do funil.
2. Compare com o benchmark.
3. Ataque **a etapa com pior gap** (não otimize o que já está bom).

**(d) Exemplo trabalhado — KPIs, benchmarks e leitura.**

| KPI | Benchmark (repo / conta) | Se estiver ruim → causa provável → ação |
|---|---|---|
| **CTR do anúncio** | flag se **< 0,8%** | criativo/oferta fracos → trocar **criativo** antes do público (🟡) |
| **CPM** | varia por posicionamento | caro → testar posicionamento WhatsApp/Facebook (historicamente baratos nesta conta) |
| **CPL (lead)** | alvo ~**R$ 12**; realista **R$ 20–40** (lote/alto ticket); histórico da conta ~R$ 27,87 | alto → headline/oferta ou público; landing |
| **Custo por conversa (CTWA)** | histórico da conta **~R$ 4–25** (Sol da Chapada R$ 3,99) | alto → criativo de feed/imagem + posicionamentos amplos |
| **Conversão da landing** (`lead_submit`/sessões) | medir e acompanhar | baixa → ver [`docs/cro-botanique.md`](../../docs/cro-botanique.md) (hipóteses de CRO) |
| **Tempo de 1ª resposta** | **< 5 min** | alto → automação M0 / notificação corretor (§8) |
| **Frequência** | refresh se **> 2,5** | alta → fadiga de criativo → renovar |
| **Dias parado no funil** | 🔴 **> 3 dias** | lead esfriando → acionar R-stage |
| **CAC** | **< R$ 900** | alto → qualidade do lead / taxa de visita |
| **ROAS** | **15x+** | baixo → oferta/fechamento |

**Regra de escala (semáforo, do método):** 🟢 verde → **+20% de orçamento a cada 3 dias**; 🔴 vermelho → cortar verba; 🟡 amarelo → **trocar criativo antes** de mexer no público.

**(e) Checklist.**
- [ ] Medi o funil inteiro (não só CPL)?
- [ ] Identifiquei a **etapa de pior gap**?
- [ ] Apliquei a regra de escala certa (🟢/🟡/🔴)?
- [ ] Dei tempo/verba mínimos antes de julgar (sair do aprendizado)?

**(f) Swipe — leitura rápida.** "CTR baixo = criativo. CPL alto com CTR ok = oferta/landing. Lead chega mas não vira conversa = speed-to-lead. Conversa não vira visita = script/objeção. Visita não fecha = oferta/fechamento."

---

## 11. Folha de diagnóstico (1 página)

> Rode **antes de escrever qualquer peça**. Preencha de cima para baixo; cada linha decide a próxima.

```
PEÇA: ____________________   PÚBLICO/ICP: ____________________   CANAL: __________

1) CONSCIÊNCIA (§1.1)      [ ]1 Inconsciente [ ]2 Problema [ ]3 Solução [ ]4 Produto [ ]5 Mais consciente
   → ponto de entrada da 1ª frase: ________________________________________________

2) SOFISTICAÇÃO (§1.2)     [ ]1 Promessa [ ]2 Promessa+ [ ]3 Mecanismo [ ]4 Mecanismo+ [ ]5 Identificação
   → grande argumento (real, da ficha): ___________________________________________

3) DESEJO DE MASSA (§1.4)  Família ___ / Investidor ___ / Construir ___
   → desejo pré-existente que vou canalizar: ______________________________________

4) OFERTA (§4)             Resultado __ / Probabilidade __ / Atraso __ / Esforço __
   → alavanca de denominador (atraso/esforço) que vou destacar: ___________________
   → reversão de risco: ________________   stack/bônus reais: ____________________

5) ESTRUTURA (§2)          Headline (10+ → escolhida): ___________________________
   → 1ª frase escorregadia (§2.1): ______________________________________________
   → reason-why + nº específico (§2.2): _________________________________________
   → prova (§2.4): ______________________________________________________________

6) GATILHO (§3)            2–3 marcados: [ ]Recipr [ ]Compr [ ]Prova [ ]Autorid [ ]Afin [ ]Escassez [ ]Unidade
   → aversão à perda/janela (§3.2): _____________________________________________
   → ancoragem/contraste (§3.3): ________________________________________________

7) CONVERSA/FECHAMENTO     Pergunta SPIN-I/N (§5.1): ____________________________
   → objeção provável + resposta (§6): __________________________________________
   → fechamento por alternativa (§7): ___________________________________________

8) CTA                     Próximo passo único e claro: __________________________
   → speed-to-lead garantido? (§8)  [ ] sim

⚠️ CONFORMIDADE (§0.3)  [ ] CRECI 9770J  [ ] Aprovar = parceira  [ ] zero promessa de valorização (hedge)
                        [ ] dados batem com empreendimento.md/tabela-precos.csv  [ ] escassez REAL  [ ] LGPD/COFECI
```

---

## Fontes / bibliografia

> ⚠️ Os links abaixo são pontos de partida canônicos (autor/obra/site oficial). **Verifique antes de qualquer publicação externa.** Onde não há certeza do URL, está marcado `[verificar link]` — não inventar.

| # | Autor / obra | Aplicação no playbook | Referência |
|---|---|---|---|
| 1 | **Eugene M. Schwartz — _Breakthrough Advertising_ (1966)** | §1 consciência, sofisticação, tipos de lead, desejo de massa | livro (Boardroom/Bottom Line) — `[verificar link]` |
| 2 | **Joseph Sugarman — _The Adweek Copywriting Handbook_** | §2.1 slippery slide, gatilhos psicológicos | livro — `[verificar link]` |
| 3 | **Claude C. Hopkins — _Scientific Advertising_ (1923, domínio público)** | §2.2 reason-why, especificidade | https://archive.org/details/scientificadvert00hopk `[verificar link]` |
| 4 | **John Caples — _Tested Advertising Methods_** | §2.3 headlines testadas | livro — `[verificar link]` |
| 5 | **David Ogilvy — _Ogilvy on Advertising_ / _Confessions of an Advertising Man_** | §2.4 clareza e prova | livro — `[verificar link]` |
| 6 | **Robert B. Cialdini — _Influence_ / _Pre-Suasion_** | §3.1 os 7 princípios | https://www.influenceatwork.com `[verificar link]` |
| 7 | **Daniel Kahneman & Amos Tversky — Prospect Theory (Econometrica, 1979); _Thinking, Fast and Slow_ (2011)** | §3.2 aversão à perda, enquadramento | artigo/livro — `[verificar link]` |
| 8 | **Alex Hormozi — _$100M Offers_** | §4 equação de valor, reversão, bônus, escassez | https://www.acquisition.com `[verificar link]` |
| 9 | **Neil Rackham — _SPIN Selling_** | §5.1 Implicação/Need-payoff | livro — `[verificar link]` |
| 10 | **David Sandler — Sandler Selling System** | §5.2 up-front contract, funil de dor | https://www.sandler.com `[verificar link]` |
| 11 | **Chris Voss — _Never Split the Difference_** | §5.3 rótulos, perguntas calibradas, accusation audit | https://www.blackswanltd.com `[verificar link]` |
| 12 | **Jeff Walker — _Launch_ / Product Launch Formula** | §9 PPPL, 3 PLCs | https://productlaunchformula.com `[verificar link]` |
| 13 | **Lead Response Management Study (Oldroyd/InsideSales/MIT) + HBR "The Short Life of Online Sales Leads" (2011)** | §8 speed-to-lead < 5 min | https://hbr.org/2011/03/the-short-life-of-online-sales-leads `[verificar link]` |

**Ativos internos referenciados (fonte de verdade e consistência):**
[`empreendimento.md`](../../clientes/botanique-residence/dados/empreendimento.md) ·
[`tabela-precos.csv`](../../clientes/botanique-residence/dados/tabela-precos.csv) ·
[`regua-botanique.md`](../../clientes/botanique-residence/whatsapp/regua-botanique.md) ·
[`m0-ativa-e-optin.md`](../../clientes/botanique-residence/whatsapp/m0-ativa-e-optin.md) ·
[`emails.md`](../emails/emails.md) ·
[`bancodecopy.csv`](../copy/bancodecopy.csv) ·
[`copy-botanique.csv`](../../clientes/botanique-residence/copy/copy-botanique.csv) ·
[`anuncios-copy.md`](../../clientes/botanique-residence/midia-paga/anuncios-copy.md) ·
[`plano-de-midia-botanique.md`](../../clientes/botanique-residence/midia-paga/plano-de-midia-botanique.md) ·
[`chatgpt-prompts.md`](../captacao/chatgpt-prompts.md) ·
[`cro-botanique.md`](../../docs/cro-botanique.md) ·
[`Biblioteca-Prompts-Execucao-AQV.md`](../../docs/Biblioteca-Prompts-Execucao-AQV.md) ·
[`README_-_01_Apostila_do_metodo.md`](../../docs/README_-_01_Apostila_do_metodo.md) ·
[`analise.md`](../../docs/analise.md) ·
[`README_-_06_Planilha_de_gestao_de_trafego_e_funil.md`](../../docs/README_-_06_Planilha_de_gestao_de_trafego_e_funil.md)

---

*Playbook de Técnicas de Venda — Imóveis AQV / Aprovar Negócios Imobiliários (CRECI 9770J). Documento de referência interno; toda peça publicada deve passar pela folha de diagnóstico (§11) e pelos guardrails de conformidade (§0.3).*
