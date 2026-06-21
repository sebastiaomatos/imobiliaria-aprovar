# Criativos de anúncio — Botanique Residence (Aprovar)

Resposta direta para captação da lista VIP. Logo da Aprovar (transparente, sobre o
render) + copy que vende a transformação (o lago, o refúgio, o patrimônio, a casa dos
sonhos), não o terreno.

## Peças (PNG em alta, prontas para subir)
| Arquivo | Formato | Ângulo | ICP | Onde usar |
|---|---|---|---|---|
| c1-story-vip.png | 9:16 | Escassez/lista VIP | geral | Stories/Reels |
| c2-feed-vip.png | 1:1 | Escassez/lista VIP | geral | Feed |
| c3-story-natureza.png | 9:16 | Estilo de vida (lago) | família | Stories (topo) |
| c4-feed-oferta.png | 1:1 | Oferta (R$ 312.500) | geral | Feed (meio/fundo) |
| c5-feed-investidor.png | 1:1 | Patrimônio real | investidor | Feed |
| c6-story-construir.png | 9:16 | Construir do seu jeito | construir | Stories |

## Logo
Versão TRANSPARENTE sobre o render (sem cartão/caixa), com drop-shadow para leitura.
Arquivo em `fontes/img/aprovar-logo.png` = versão clara (p/ fundo escuro). Para fundo
claro, usar a versão de subtítulo escuro do kit de marca.

## Aviso legal (mínimo, por peça)
Só o estritamente necessário e discreto: CRECI 9770J sempre; "imagens ilustrativas"
(há render); "valores sujeitos a alteração" só quando a peça mostra preço. A peça sem
preço (c3) não leva aviso de valores. Avisos completos ficam na landing.

## Conformidade
CRECI 9770J · sem promessa de valorização (investidor usa ângulo de patrimônio
tangível, não retorno) · render ilustrativo · datas 12/07 e 19/07 (confirmar Urba).

## Editar / variar
HTML+CSS (`fontes/`). `_base.css` governa o estilo. Duplique um `.html`, troque imagem +
headline + chips, renderize com Playwright (viewport = dimensão; screenshot do `#cap`).
