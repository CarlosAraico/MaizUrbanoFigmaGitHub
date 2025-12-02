# Backend Docker (workspace root)

Usa `Dockerfile.backend` en la raiz para construir la imagen del backend con workspaces.

## Build local rapido (VS Code terminal)
```bash
set -euo pipefail

echo "🔧 Verificando lock..."
if [ ! -f package-lock.json ] && [ ! -f backend/package-lock.json ]; then
  echo "ℹ️ No hay lockfiles; generando lock raíz..."
  npm i --package-lock-only
fi

echo "🧹 Asegurando .dockerignore..."
cat > .dockerignore <<'EOF'
**/node_modules
**/.DS_Store
**/artifacts
**/.env
**/*.local
**/*.log
.git
dist
build
coverage
EOF

echo "🏗 Build local (Dockerfile.backend + workspaces)..."
docker buildx build -f Dockerfile.backend -t ghcr.io/carlosaraico/maizurbanofigmagithub-backend:latest .

echo "✅ Build OK. Para publicar:"
echo "   docker login ghcr.io -u <USER> -p <TOKEN>"
echo "   docker push ghcr.io/carlosaraico/maizurbanofigmagithub-backend:latest"
echo "   SHORT=$(git rev-parse --short HEAD); docker tag ghcr.io/carlosaraico/maizurbanofigmagithub-backend:latest ghcr.io/carlosaraico/maizurbanofigmagithub-backend:sha-$SHORT"
echo "   docker push ghcr.io/carlosaraico/maizurbanofigmagithub-backend:sha-$SHORT"
```
