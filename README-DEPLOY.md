# Backend MU v4 - Deploy

Guia rapida para levantar el backend de inventario (webhook con SQLite) localmente y en un VPS usando GHCR.

## Variables de entorno

Copia `backend/.env.example` a `backend/.env` y ajusta:

- `PORT`: puerto expuesto (default 4000).
- `DB_PATH`: ruta del archivo SQLite dentro del contenedor/host (`/app/data/inventory.db` recomendado en Docker).
- `WEBHOOK_SECRET`: secreto compartido para validar el webhook (`X-Webhook-Secret`).

## Local (Node + SQLite)

```bash
cp backend/.env.example backend/.env
npm ci --prefix backend
node backend/server.js
# o
npm run dev --prefix backend
```

## Local con Docker Compose

```bash
cp backend/.env.example backend/.env
docker compose up --build backend
```

La base se guarda en `./backend/data/`. El endpoint queda en `http://localhost:4000`.

## Imagen en GHCR

- La accion `.github/workflows/docker-publish.yml` publica `ghcr.io/<owner>/<repo>-backend:latest` al pushear a `main`.
- Login manual (si hace falta):

```bash
echo $GHCR_TOKEN | docker login ghcr.io -u <github_user> --password-stdin
IMAGE=ghcr.io/carlosaraico/maizurbanofigmagithub-backend:latest
docker build -t $IMAGE -f backend/Dockerfile backend
docker push $IMAGE
```

## Deploy en VPS (Compose prod)

```bash
scp -r backend docker-compose.prod.yml user@vps:/srv/mu-backend
ssh user@vps
cd /srv/mu-backend
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

Asegurate de tener `backend/.env` en el servidor y un volumen persistente para `backend/data`.

## Ngrok / pruebas de webhook

```bash
ngrok http 4000

curl -X POST https://<ngrok>.ngrok.io/webhook/inventory \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: $WEBHOOK_SECRET" \
  -d '{
        "eventId": "evt-001",
        "source": "qa",
        "changes": [
          {"sku": "MU-MAIZ-AZUL-01", "name": "Maiz azul", "quantity": 110},
          {"sku": "MU-EMPAQUE-01", "delta": -5}
        ]
      }'
```

La idempotencia se basa en `eventId`: enviar el mismo ID responde `duplicate` sin re-aplicar cambios.
