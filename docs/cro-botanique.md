# CRO — Landing de captação VIP do Botanique (Aprovar)

> Página: [`clientes/botanique-residence/landings/cadastro-vip/index.html`](../clientes/botanique-residence/landings/cadastro-vip/index.html)
> Objetivo único: **maximizar cadastros qualificados na Lista VIP**. Nada na página compete com isso.
>
> **A superioridade é PROVADA por teste A/B contra dados — não afirmada.** Este doc registra as
> hipóteses de conversão e como medi-las. "Melhor que a LP da construtora" é uma hipótese a validar
> com `lead_submit`/sessão, não um fato declarado.

## 1. Métrica-norte e métricas de apoio

- **Norte:** taxa de conversão = `lead_submit` / sessões (por origem/UTM).
- **Qualidade (a real meta):** **CPL qualificado** = custo por lead que responde no WhatsApp / agenda
  visita — não o CPL puro. Um form nativo barato que não engaja não vale o lead caro que vira venda.
- **Apoio (diagnóstico):** `click_whatsapp` (intenção alternativa), `engaged_15s` (atenção/scroll),
  scroll-depth até o form, drop-off por campo (futuro), velocidade (LCP/CLS).
- **Atribuição:** UTMs no destino gravam `fonte` no orquestrador (lead → Praedium/Brevo), permitindo
  ler conversão **por campanha/criativo** e fechar o loop com o `anuncios-copy.md`.

## 2. Por que esta página deve superar a LP oficial (hipóteses, por fraqueza deles)

| Fraqueza da LP da Urba (folder institucional) | Nossa resposta (hipótese de conversão) |
|---|---|
| **Zero urgência/escassez** — ignora a fase VIP e as datas | Faixa + **timeline datada 15/07 × 19/07** com "4 dias antes" e **custo de inação** (o lote de frente pro lago "já tem dono"). Aversão à perda legítima é a maior alavanca que falta a eles. |
| **Oferta escondida** numa imagem no rodapé | **Oferta no H1 e nas specs** (R$ 312.500 · entrada R$ 31.250 · 24x) — qualifica o lead no 1º scroll. |
| **CTAs genéricos e diluídos em 3 opções** | **Uma conversão** (Lista VIP). CTA de **valor/ação**, nunca "Enviar". WhatsApp é alternativa secundária, não concorrente. |
| **Form com fricção + consentimento genérico** | 4 campos só. **Opt-in value-framed** (benefício, desmarcado, obrigatório) + **reversão de risco** ao lado do botão. |
| **Sem reversão de risco** | "Gratuito, sem compromisso, sai quando quiser, atendimento humano, LGPD" junto ao form. |
| **Site pesado (WordPress/Elementor)** | **Página estática**, 1 arquivo, CSS/JS inline, imagens `lazy` abaixo da dobra, hero com `preload`. Velocidade = conversão. |
| **Sem CTA persistente no mobile** | **Sticky CTA** fixo no rodapé do mobile — a ação está sempre a um toque. |

## 3. Hipóteses de CRO por bloco

Cada bloco foi escolhido por um painel de copy/CRO (4 blueprints independentes → 3 juízes → síntese).
Racional resumido + como medir:

1. **Hero (oferta + sonho + VIP).** *Hipótese:* liderar pela **oferta concreta** (preço/entrada/24x)
   no H1+specs, com subhead sensorial (lago/pier), qualifica e desperta desejo no 1º scroll. *Mede:*
   scroll-past-hero, `lead_submit`/sessão. *A/B:* ver §5.
2. **Faixa de escassez (logo após o hero).** *Hipótese:* reforço imediato do "por que agora" eleva a
   intenção antes do conteúdo. *Mede:* conversão com/sem a faixa (teste futuro).
3. **O sonho (lago/pôr do sol).** *Hipótese:* desejo sensorial sustenta o preço pela emoção (vender a
   transformação, não o terreno). *Mede:* scroll-depth, tempo na seção.
4. **Lazer (clube pronto).** *Hipótese:* prova concreta do estilo de vida + amarração ao gancho VIP
   ("o melhor lote você escolhe antes") converte desejo em ação.
5. **Autoridade/procedência.** *Hipótese:* Urba/MRV&CO + arquiteto + BRAIN + escala (441/17) reduzem
   risco percebido e fricção — credibilidade que o lead da Aprovar (parceira) precisa ver.
6. **Condições (stack de oferta).** *Hipótese:* ancoragem de preço + transparência ("sem letra miúda")
   aumentam confiança; separar **24x ≠ R$ 3.204/mês** evita objeção/sensação de pegadinha.
7. **Localização + investidor.** *Hipótese:* âncoras regionais (Coxipó/UFMT/Shopping 3 Américas) +
   **hedge factual** de valorização atendem o público "investir" sem prometer retorno. O bloco vira
   gancho de captura ("na VIP enviamos o mapa").
8. **Crescendo VIP (value-stack + timeline).** *Hipótese:* reposicionar o cadastro de "newsletter"
   para **posição de vantagem concreta** eleva o valor percebido da única conversão; a timeline datada
   materializa a urgência. *Mede:* conversão do bloco final, cliques no CTA pós-crescendo.
9. **CTA final (fechamento por escassez).** *Hipótese:* "alguém vai escolher o lote de frente pro
   lago — que seja você" fecha por aversão à perda. *Mede:* cliques no CTA final.
10. **Sticky CTA (mobile).** *Hipótese:* CTA sempre visível reduz o atrito de "rolar de volta" e
    captura a intenção no pico. *Mede:* cliques no sticky vs CTAs inline (taguear no futuro).

## 4. Instrumentação & medição

- **`lead_submit` dispara SOMENTE no sucesso do POST** ao orquestrador (`CONFIG.formEndpoint`) — não
  no clique. Isso mantém a taxa de conversão **honesta** (lead realmente registrado). Fallback
  `via:"whatsapp_only"` só quando não há endpoint.
- Eventos enviados a `fbq`/`gtag`/`dataLayer`: `lead_submit`, `click_whatsapp`, `engaged_15s`.
- **TODO de medição (painel, não código):** importar `lead_submit` como conversão no GA4 e no Pixel
  (ver `midia-paga/config-campanhas.md`); marcar UTMs nos anúncios; acompanhar **CPL qualificado** no
  CRM (lead que responde) — não só o CPL.
- **`{{VAGAS_VIP}}`** (`CONFIG.vagasVip`): placeholder. Se a Urba confirmar nº de vagas, definir o
  número → a timeline troca "Você aqui" por "N vagas VIP" (escassez numérica). Sem isso, **escassez por
  data** (não inventar vagas).

## 5. Plano de A/B (deixar pronto para validar a superioridade)

Rodar **um teste por vez**, com volume suficiente (idealmente ≥ ~100 conversões/variante ou ~2 semanas;
com a verba de R$ 2.000 isto pode levar mais — priorizar o teste de maior alavanca primeiro).

| # | Elemento | A (atual) | B (variante) | Hipótese |
|---|---|---|---|---|
| 1 | **H1** | "Um lote de frente para o lago em Cuiabá, a partir de R$ 312.500" (oferta) | "Sua família a poucos passos de um lago com praia particular" (estilo de vida) | Oferta-led qualifica melhor; lifestyle-led pode ampliar topo. |
| 2 | **CTA hero** | "Quero meu lote na Lista VIP" | "Quero escolher meu lote 4 dias antes" (variante já redigida) | Enquadrar pela vantagem temporal pode bater o enquadramento por posse. |
| 3 | **Form** | hero card (2 colunas no desktop) | form no topo absoluto no mobile (sem rolar) | Reduzir distância até o campo no mobile. |

Implementação simples sem framework: duplicar a página como `index-b.html` ou alternar via querystring
(`?v=b`) gravando a variante no payload (`data.variante`) para segmentar `lead_submit` por braço. Decidir
pelo **CPL qualificado**, não pelo CPL puro.

## 6. Conformidade como alavanca de confiança (não só obrigação)

- Valorização **só como expectativa factual** ("região em expansão", "alto potencial de valorização") e
  o anti-hype **"desconfie de quem promete número"** — transforma a restrição legal em **prova de
  honestidade** (diferencial de confiança vs. anúncios que prometem retorno). Regra detalhada em
  [`midia-paga/anuncios-copy.md`](../clientes/botanique-residence/midia-paga/anuncios-copy.md).
- CRECI 9770J visível; Aprovar = **parceira na venda** (Botanique é da Urba/MRV&CO); "renders",
  "a partir de", "sujeitos a alteração", "Não há promessa de valorização" no rodapé. Opt-in LGPD
  value-framed, desmarcado e obrigatório.

## 7. Backlog de otimização (próximos ganhos)

- **Recompressão de imagens** (hoje ~10 MB no total; mapa e masterplan >1 MB). Converter para WebP/AVIF
  e redimensionar para o tamanho de exibição deve cortar o peso ~70% e melhorar o LCP — maior ganho de
  performance pendente (precisa de ferramenta de imagem; renderização atual já usa `lazy` + `preload`).
- `srcset`/`sizes` para servir imagens menores no mobile.
- Tag dedicada no sticky CTA vs CTAs inline para medir origem do clique.
- Teste de **prova social** assim que houver (depoimentos/quantos já na lista) — **não inventar**.
- Microcopy de erro por campo (validação inline) para reduzir drop-off.

## 8. O que mudou vs. a versão anterior da nossa LP

- Hero passou de estilo-de-vida puro para **oferta-led** (preço/entrada/24x no H1+specs) mantendo o
  lirismo na subhead.
- **Novo:** bloco de **autoridade/procedência** (Urba/MRV&CO, Jhonny Rother, Eduardo Lara, BRAIN,
  441/17) — credibilidade que faltava.
- **Novo:** **crescendo VIP** = value-stack ("o que você recebe") + **timeline datada** 15/07×19/07 com
  custo de inação (antes era só uma faixa de texto).
- **Novo:** **bloco do investidor** com hedge de valorização; **âncoras de localização** (Coxipó/UFMT/
  Shopping 3 Américas/Parque Tia Nair).
- **Novo:** **sticky CTA** no mobile; reversão de risco ao lado do form; `loading="lazy"` + `preload`
  do hero; `{{VAGAS_VIP}}` como placeholder de escassez numérica.
- Funil preservado: POST ao orquestrador com `whatsapp_optin`, `lead_submit` só no sucesso, link da
  Política, opt-in com o texto exato exigido.
