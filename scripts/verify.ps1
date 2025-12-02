param(
[string]$Base = $env:PLUGIN_BASE,
[string]$Secret = $env:WEBHOOK_SECRET,
[string]$MaterialId = $(if ($env:MATERIAL_ID) { $env:MATERIAL_ID } else { "corn-blue" }),
[int]$NewStock = $(if ($env:NEW_STOCK) { [int]$env:NEW_STOCK } else { 123 })
)

function Fail([string]$msg) { Write-Error "❌ $msg"; exit 1 }
function Ok([string]$msg) { Write-Host "✅ $msg" }

# Carga opcional desde figma-plugin/.env.local si faltan valores
if (([string]::IsNullOrWhiteSpace($Base) -or [string]::IsNullOrWhiteSpace($Secret)) -and (Test-Path "figma-plugin/.env.local")) {
  foreach ($line in Get-Content "figma-plugin/.env.local") {
    if ($line -match '^(PLUGIN_BASE|PLUGIN_SECRET|WEBHOOK_SECRET)=(.*)$') {
      $k = $Matches[1]; $v = $Matches[2];
      if ([string]::IsNullOrWhiteSpace($Base) -and $k -eq "PLUGIN_BASE") { $Base = $v }
      if ([string]::IsNullOrWhiteSpace($Secret) -and ($k -eq "PLUGIN_SECRET" -or $k -eq "WEBHOOK_SECRET")) { $Secret = $v }
    }
  }
}

if ([string]::IsNullOrWhiteSpace($Base) -or [string]::IsNullOrWhiteSpace($Secret)) {
  Write-Host "Uso:"
  Write-Host "  setx PLUGIN_BASE https://*.ngrok-free.dev"
  Write-Host "  setx WEBHOOK_SECRET xxx"
  Write-Host "  npm run test:e2e:win"
  exit 2
}

$EventId = "evt-$([int][double]::Parse((Get-Date -UFormat %s)))"
Write-Host "🔎 BASE=$Base"
Write-Host "🔎 SECRET=***"
Write-Host "🔎 MATERIAL_ID=$MaterialId"
Write-Host "🔎 NEW_STOCK=$NewStock"
Write-Host "🔎 EVENT_ID=$EventId"

# Health local
try { iwr -UseBasicParsing "http://127.0.0.1:4000/api/health" -ErrorAction Stop | Out-Null } catch { Fail "Health LOCAL falló" }
Ok "Health LOCAL ok"

# Health remoto
try { iwr -UseBasicParsing "$Base/api/health" -ErrorAction Stop | Out-Null } catch { Fail "Health REMOTO (ngrok) falló" }
Ok "Health REMOTO ok"

$body = @{ event_id=$EventId; material_id=$MaterialId; new_stock=$NewStock } | ConvertTo-Json -Compress

# Webhook inicial
try {
  $resp1 = iwr -UseBasicParsing -Method Post "$Base/api/webhooks/inventory" -Headers @{ "X-Webhook-Secret"="$Secret" } -ContentType "application/json" -Body $body -ErrorAction Stop
} catch { Fail "Webhook inicial falló" }
Ok "Webhook inicial ok: $($resp1.Content)"

# Idempotencia
try {
  $resp2 = iwr -UseBasicParsing -Method Post "$Base/api/webhooks/inventory" -Headers @{ "X-Webhook-Secret"="$Secret" } -ContentType "application/json" -Body $body -ErrorAction Stop
} catch { Fail "Webhook idempotente falló" }
Ok "Webhook idempotente ok: $($resp2.Content)"

# Inventario
try {
  $inv = (iwr -UseBasicParsing "$Base/api/inventory/$MaterialId" -ErrorAction Stop).Content
} catch { Fail "Inventario falló" }
Write-Host "📦 Inventory → $inv"

# Validar stock
$stock = [regex]::Match($inv, '"stock"\s*:\s*(\d+)').Groups[1].Value
if ($stock -ne "$NewStock") { Fail "Stock esperado $NewStock, recibido $stock" }
Ok "Stock verificado ($stock)"

Write-Host "🎉 Todo OK"
exit 0
