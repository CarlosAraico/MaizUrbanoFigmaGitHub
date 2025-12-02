# Maiz Urbano - Dev Stack

Monorepo con backend Express + SQLite, frontend Vite+React+Tailwind y plugin de Figma. Usa npm workspaces.

## Quickstart
```bash
npm run setup          # instala deps de workspace y prepara backend/.env si no existe
npm run up             # dev backend + frontend + plugin watch + tunel ngrok
# Backend: http://127.0.0.1:4000/api/health
# Frontend: http://127.0.0.1:5173
# Ngrok: URL https impresa en consola, y escribe figma-plugin/.env.local
```

## Comandos utiles
- `npm run down`: detiene tunel ngrok.
- `npm run build`: build backend/frontend/plugin.
- `npm run zip:plugin`: genera `figma-plugin/mu-figma-plugin.zip` desde `figma-plugin/dist`.

## Estructura
- `backend/`: API Express (`/api/health`, `/api/inventory/:id`, webhook idempotente `/api/webhooks/inventory`).
- `frontend/`: Vite+React+Tailwind, Hero y consulta de inventario.
- `figma-plugin/`: plugin Figma (Vite). Usa `.env.local` con `PLUGIN_BASE` y `PLUGIN_SECRET` escritos por `scripts/tunnel.mjs`.
- `scripts/tunnel.mjs`: espera al backend, abre ngrok https y sincroniza env del plugin.

## Webhook de inventario
POST `/api/webhooks/inventory` con header `X-Webhook-Secret` y payload:
```json
{
  "event_id": "evt-001",
  "material_id": "corn-blue",
  "new_stock": 110
}
```
Idempotencia: eventos repetidos (mismo `event_id`) responden `idempotent: true` sin aplicar cambios.

## Plugin Figma
1) Corre `npm run up` y espera el tunel (https) impreso.
2) En Figma Desktop: Plugins -> Development -> Import from manifest -> `figma-plugin/manifest.json`.
3) El plugin lee `PLUGIN_BASE` y `PLUGIN_SECRET` desde `.env.local` para consumir el backend.
