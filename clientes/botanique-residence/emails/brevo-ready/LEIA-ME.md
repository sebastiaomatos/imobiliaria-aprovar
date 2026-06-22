# E-mails brevo-ready — Botanique Residence

Estes 6 HTML são **derivados** dos canônicos em [`../`](../) (os canônicos guardam os
placeholders — são o template). Aqui já estão com tudo substituído, **prontos para colar no
Brevo**:

| Placeholder (template) | Substituído por |
|---|---|
| `{{IMG_BASE}}` | `https://imobiliaria-aprovar.netlify.app/email-img` |
| `{{nome}}` | `{{contact.NOME}}` (atributo de contato do Brevo) |
| `{{UNSUB}}` | `{{ unsubscribe }}` (tag de descadastro do Brevo) |
| `{{ACESSO_VIP}}` | `12/07` |
| `{{LANCAMENTO_GERAL}}` | `19/07` |

## Como publicar no Brevo

1. Em **Campanhas → E-mail → Criar**, escolha **“Pasta de código” / editor HTML** (cole o
   código), não o editor visual.
2. Abra o `.html` desejado, **copie todo o conteúdo** e cole no editor de código do Brevo.
3. **Assunto:** está no comentário `<!-- ... -->` no topo de cada arquivo
   (`Assunto sugerido: ...`). Há também o *preheader* (a `<div>` escondida logo após o `<body>`).
4. **Confira o atributo de nome:** este material usa `{{contact.NOME}}`. Em
   **Brevo → Contatos → Atributos**, confirme que existe um atributo de nome chamado **NOME**.
   Se o seu se chamar diferente (ex.: `FNAME`, `NOME_COMPLETO`), troque `{{contact.NOME}}`
   nos HTML para `{{contact.SEU_ATRIBUTO}}`.
5. O **descadastro** usa a tag nativa `{{ unsubscribe }}` do Brevo — funciona automaticamente
   ao enviar pela plataforma.
6. As **imagens** vêm do host público (Netlify, pasta `/email-img`). Confirme que o deploy
   da landing está no ar (as imagens limpas ficam em
   `landings/cadastro-vip/email-img/`, publicadas junto com a landing).

## Cadência (resumo)

| # | Disparo | Arquivo |
|---|---|---|
| 1 | Imediato (boas-vindas VIP) | `email-1-boasvindas-vip.html` |
| 2 | D1 (diferenciais) | `email-2-diferenciais.html` |
| 3 | D2 (condições — masterplan + 2 blocos) | `email-3-condicoes.html` |
| 4 | 12/07 (acesso antecipado) | `email-4-acesso-antecipado.html` |
| 5 | 1–2 dias antes do geral (escassez) | `email-5-escassez.html` |
| 6 | 19/07 (lançamento geral) | `email-6-lancamento-geral.html` |

Detalhes de cada peça (assunto/preheader/objetivo) em [`../README.md`](../README.md).

## ⚠️ Antes de disparar

- **Datas:** 12/07 (VIP) e 19/07 (geral) estão **hardcoded** aqui. Se a Urba confirmar outra
  data (há divergência 12/07 vs 15/07), **regere estes arquivos** dos canônicos ou ajuste à mão.
- Para **regenerar** após editar os canônicos: reaplique as substituições da tabela acima.
- Faça um **envio de teste** (para você mesmo) e confira no celular antes do disparo real.
