# Orquestrador (Node / Fastify)

Código da automação que conecta landing → Praedium → Z-API (WhatsApp) → Gemini (laudo) → Brevo (e-mail) → CAPI (Meta).

Se o código já vive em outro repositório/pasta, você tem duas opções:
1. **Centralizar:** mover o código do orquestrador para cá e versionar tudo junto.
2. **Separar:** manter o orquestrador no próprio repositório e deixar esta pasta apenas como referência.

Variáveis de ambiente esperadas ficam em `.env` (ver `.env.example` quando criado). Nunca commitar segredos.
