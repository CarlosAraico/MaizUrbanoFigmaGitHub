#!/usr/bin/env bash
set -euo pipefail

echo "[1/4] Reparar instalacion de dependencias (Rollup fix)"
rm -rf node_modules package-lock.json
npm install
npm i @rollup/rollup-linux-x64-gnu || true

echo "[2/4] Validacion de tipos (TS)"
if npm run tsc -- --noEmit 2>/dev/null; then
  :
else
  npm exec -w frontend tsc -- --noEmit
  npm exec -w figma-plugin tsc -- --noEmit
fi

echo "[3/4] Linting"
if [ -f .eslintrc.js ] || [ -f .eslintrc.json ]; then
  npx eslint . --ext .js,.ts,.tsx
else
  echo "No se encontro configuracion ESLint, se omite."
fi

echo "[4/4] Build monorepo"
npm run build

echo "Validacion local finalizada"
