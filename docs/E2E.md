# E2E - Webhook e Inventario

## Requisitos
- `npm run setup && npm run up` (levanta backend:4000, frontend:5173 y ngrok; crea `figma-plugin/.env.local`).
- Asegura que `WEBHOOK_SECRET` coincide con `PLUGIN_SECRET`.

## Ejecutar pruebas
```bash
# macOS/Linux
PLUGIN_BASE=https://TU-NGROK.ngrok-free.dev \
WEBHOOK_SECRET=xxxxxxxx \
npm run test:e2e

# Windows
setx PLUGIN_BASE https://TU-NGROK.ngrok-free.dev
setx WEBHOOK_SECRET xxxxxxxx
npm run test:e2e:win
```

## Que valida
- `/api/health` local y remoto.
- Webhook con `event_id` unico.
- Idempotencia (mismo `event_id`).
- Lectura y verificacion de stock.
