# Orquestrador (Node / Fastify)

Automação que conecta landing → Praedium → Z-API (WhatsApp) → Gemini (laudo) → Brevo (e-mail) → Meta CAPI, para o sistema Imóveis AQV.

## Rodar localmente

```bash
cd orquestrador
npm install
cp .env.example .env   # preencha os valores (o servidor também lê o .env da raiz como fallback)
npm run dev            # com --watch; ou: npm start
```

O servidor sobe em `http://localhost:3000` (ou na porta de `$PORT`).

## Rotas

- `GET /` — healthcheck: `{ status: "ok", service: "orquestrador-aqv", ts }`.
- `POST /webhook/lead` — recebe leads. Exige o header `x-webhook-secret` igual ao `WEBHOOK_SECRET`; caso contrário responde **401**. Por ora apenas loga o corpo recebido (o fluxo completo entra no 0.7).

## Variáveis de ambiente

Ver `.env.example`. Segredos **nunca** são versionados (`.env` é ignorado pelo git). Em produção, defina-as na aba **Variables** do Railway. A validação no boot avisa o que estiver faltando, mas **não derruba** o servidor.

## Deploy no Railway

- **Root Directory** = `orquestrador` (Settings › Service › Source).
- **Start Command** = `npm start` (Node é detectado automaticamente).
- O servidor escuta em `0.0.0.0` e na porta `process.env.PORT` (injetada pelo Railway).
- Gere um domínio em Settings › Networking e teste o `GET /`.
