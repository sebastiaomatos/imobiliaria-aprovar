# Imagens dos e-mails — versões LIMPAS (sem a faixa/rótulo da Urba)

Os e-mails exibem a imagem inteira (<img width="600">), então a faixa verde com os
rótulos ("PIER", "PISCINA", "ENTRADA"…) que vinha nos renders foi RECORTADA aqui.

## O que fazer
Hospedar ESTES arquivos na URL pública apontada por {{IMG_BASE}} (host de imagens do
Brevo ou outro), mantendo EXATAMENTE os mesmos nomes:
- 01-vista-aerea-lago.jpg  (já era limpa — cheia)
- 02-entrada.jpg           (faixa direita removida)
- 04-pier-por-do-sol.jpg   (faixa esquerda removida)
- 05-faixa-de-areia.jpg    (faixa esquerda removida)
- 06-piscina.jpg           (faixa direita removida)
- 07-pista-cooper-pergolado.jpg (faixa esquerda removida)
- 17-masterplan.png        (planta do loteamento — limpa, sem faixa; topo do e-mail 3)

Depois, no template, {{IMG_BASE}} = a URL pública dessa pasta (sem barra no final).
Recomendo guardar uma cópia também em clientes/botanique-residence/imagens/email/ no repo.
