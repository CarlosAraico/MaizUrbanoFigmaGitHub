#!/usr/bin/env bash
set -euo pipefail

# --- Config ---
BASE="${PLUGIN_BASE:-${1:-}}"
SECRET="${WEBHOOK_SECRET:-${2:-}}"
MAT_ID="${MATERIAL_ID:-corn-blue}"
NEW_STOCK="${NEW_STOCK:-123}"
EVENT_ID="evt-$(date +%s)"

fail() { echo "❌ $*" >&2; exit 1; }
ok()   { echo "✅ $*"; }

# Carga opcional desde figma-plugin/.env.local si no viene por env/argv
if [[ ( -z "${BASE}" || -z "${SECRET}" ) && -f "figma-plugin/.env.local" ]]; then
  while IFS='=' read -r key val; do
    case "$key" in
      "PLUGIN_BASE") [[ -z "${BASE}" ]] && BASE="$val" ;;
      "PLUGIN_SECRET") [[ -z "${SECRET}" ]] && SECRET="$val" ;;
      "WEBHOOK_SECRET") [[ -z "${SECRET}" ]] && SECRET="$val" ;;
    esac
  done < <(grep -E '^(PLUGIN_BASE|PLUGIN_SECRET|WEBHOOK_SECRET)=' figma-plugin/.env.local || true)
fi

if [[ -z "${BASE}" || -z "${SECRET}" ]]; then
  cat <<EOF >&2
Uso:
  PLUGIN_BASE=https://*.ngrok-free.dev WEBHOOK_SECRET=xxx npm run test:e2e
  ó
  bash scripts/verify.sh https://*.ngrok-free.dev xxx
EOF
  exit 2
fi

echo "🔎 BASE=${BASE}"
echo "🔎 SECRET=***"
echo "🔎 MATERIAL_ID=${MAT_ID}"
echo "🔎 NEW_STOCK=${NEW_STOCK}"
echo "🔎 EVENT_ID=${EVENT_ID}"

# --- Health local ---
curl -fsS "http://127.0.0.1:3000/api/health" >/dev/null || fail "Health LOCAL falló"
ok "Health LOCAL ok"

# --- Health remoto (ngrok) ---
curl -fsS "${BASE}/api/health" >/dev/null || fail "Health REMOTO (ngrok) falló"
ok "Health REMOTO ok"

# --- Primer webhook ---
resp1="$(
  curl -fsS -X POST "${BASE}/api/webhooks/inventory" \
    -H "Content-Type: application/json" \
    -H "X-Webhook-Secret: ${SECRET}" \
    -d "{\"event_id\":\"${EVENT_ID}\",\"material_id\":\"${MAT_ID}\",\"new_stock\":${NEW_STOCK}}"
)" || fail "Webhook inicial falló"
ok "Webhook inicial ok: ${resp1}"

# --- Idempotencia (mismo event_id) ---
resp2="$(
  curl -fsS -X POST "${BASE}/api/webhooks/inventory" \
    -H "Content-Type: application/json" \
    -H "X-Webhook-Secret: ${SECRET}" \
    -d "{\"event_id\":\"${EVENT_ID}\",\"material_id\":\"${MAT_ID}\",\"new_stock\":${NEW_STOCK}}"
)" || fail "Webhook idempotente falló"
ok "Webhook idempotente ok: ${resp2}"

# --- Leer inventario ---
inv_json="$(curl -fsS "${BASE}/api/inventory/${MAT_ID}")" || fail "Inventario falló"
echo "📦 Inventory → ${inv_json}"

# --- Validar stock ---
# Extrae número crudo sin depender de jq
stock="$(printf "%s" "${inv_json}" | sed -E 's/.*\"stock\"[[:space:]]*:[[:space:]]*([0-9]+).*/\1/')"
[[ "${stock}" == "${NEW_STOCK}" ]] || fail "Stock esperado ${NEW_STOCK}, recibido ${stock}"
ok "Stock verificado (${stock})"

echo "🎉 Todo OK"
