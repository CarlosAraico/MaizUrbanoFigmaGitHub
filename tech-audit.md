# Auditoria Tecnica - Maiz Urbano

Version: 1.0  
Fecha: 2025-12-03

---

## Stack Tecnico

- Frontend: React + TypeScript + TailwindCSS + Vite
- Backend: Node.js + Express (API ligera)
- Plugin Figma: UI embebida + postMessage
- Scripts: Node y Bash/PowerShell (verify, plugin doctor, plugin start)
- Infra: GitHub Actions, Docker, DevContainer
- Salud y calidad: healthcheck API, cabecera de webhook, CORS

---

## Estructura del repositorio

```
MaizUrbanoFigmaGitHub/
|-- backend/            API Node/Express
|-- figma-plugin/       Build y watch del plugin Figma
|-- frontend/           Web React + Tailwind + Vite
|-- .github/workflows/  CI/CD (inventarios, plugin-release, e2e, etc.)
|-- .devcontainer/      Entorno VS Code contenedorizado
|-- scripts/            plugin-start.mjs, verify.*, plugin doctor, build zip
|-- validate-all.sh     Script unificado de validacion local
|-- Dockerfile.backend  Imagen backend (workspaces)
|-- backend/Dockerfile  Imagen backend directa
|-- docker-compose*.yml Compose de backend
```

---

## Validaciones clave

- `validate-all.sh`: actionlint (workflows YAML) -> `npm ci` -> `tsc --noEmit` (frontend y figma-plugin) -> ESLint opcional (si existe config) -> `npm run build` -> docker build opcional.
- `npm run build` usa npm-run-all para orquestar `build:backend`, `build:frontend` y `build:plugin`. El backend hace un build ligero (mensaje) y los paquetes frontend y plugin hacen build completo con Vite.
- Workflows en `.github/workflows/`: inventarios.yml, plugin-release.yml, plugin-artifact.yml, e2e-local.yml, e2e-remote.yml, e2e-ngrok.yml, ci.yml, deploy-prod.yml, docker-publish.yml.
- DevContainer permite correr el mismo set de validaciones dentro de contenedor con Node 20, Python3 y actionlint.

---

## DevContainer

- Base: `mcr.microsoft.com/devcontainers/typescript-node:20`.
- Incluye Python3 + pip (usa `requirements.txt`), actionlint y globales eslint/prettier.
- `postCreateCommand`: `npm ci --no-audit --no-fund`.
- Puertos reenviados: 4000 (API) y 5173 (Vite).
- Extensiones VS Code: Prettier, ESLint, GitHub Actions, YAML, Docker.

---

## Seguridad y calidad

- Backend requiere `WEBHOOK_SECRET` en `backend/.env` y valida la cabecera `x-webhook-secret`.
- Idempotencia de webhooks con `event_id` almacenado en memoria para evitar reprocesos.
- CORS habilitado; considerar origenes permitidos explicitos antes de exponer a produccion.
- Healthcheck disponible en `/api/health` para monitoreo basico.

---

## Recomendaciones futuras

- [ ] Agregar ESLint y reglas compartidas para backend y monorepo.
- [ ] Agregar pruebas unitarias con Vitest o Jest (hooks, utils, endpoints).
- [ ] Documentar API (Swagger o Redocly) y contratos de webhook.
- [ ] Anadir Storybook para componentes visuales.
- [ ] Monitoreo de uptime y alertas sobre el webhook.

---

## Estado actual

- Validable localmente con `./validate-all.sh` (actionlint + tsc + build + docker opcional).
- DevContainer listo para uso en VS Code.
- Workflows de CI/CD presentes para inventario, plugin y e2e.
