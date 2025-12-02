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

## Reporte JSON
El verificador Node escribe `artifacts/e2e-report.json` (ruta configurable con `REPORT_PATH` o `--report=...`). Se adjunta como artifact en los workflows.

## Workflows
- **E2E local (sin tunel)**: `e2e-local.yml` levanta backend en CI y prueba con `PLUGIN_BASE=http://127.0.0.1:4000`.
- **E2E remoto (tunel manual)**: `e2e-remote.yml` usa tu URL ngrok ingresada en `workflow_dispatch`.
- **E2E ngrok (autogestionado)**: `e2e-ngrok.yml` requiere `NGROK_AUTHTOKEN` en Secrets; expone puerto 4000, define `PLUGIN_BASE` y corre el E2E.

### Secrets requeridos
- `WEBHOOK_SECRET` (igual a `PLUGIN_SECRET` del plugin).
- `NGROK_AUTHTOKEN` (solo para `e2e-ngrok.yml`).
