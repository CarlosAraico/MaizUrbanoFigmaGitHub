param(
    [string]$ApiBase = "http://localhost:3000/api",
    [string]$AdminEmail = "admin@test.com",
    [string]$AdminPassword = "123456",
    [string]$TestImagePath = ".\test.jpg"
)

$results = @()

function Add-Result {
    param(
        [string]$Name,
        [bool]$Success,
        [string]$Details = ""
    )
    $results += [pscustomobject]@{
        Name    = $Name
        Success = $Success
        Details = $Details
        Time    = (Get-Date).ToString("s")
    }
}

Write-Host "=== QA EXTENDIDO MaizUrbano ==="
Write-Host "API: $ApiBase"
Write-Host ""

# Cargar System.Web para HttpUtility
Add-Type -AssemblyName System.Web -ErrorAction SilentlyContinue

# 1) LOGIN
$token = $null
$user  = $null

try {
    Write-Host "-> TEST: LOGIN"
    $body = @{
        email    = $AdminEmail
        password = $AdminPassword
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "$ApiBase/auth/login" -Method Post -ContentType "application/json" -Body $body
    $token = $loginResponse.token
    $user  = $loginResponse.user

    if (-not $token) {
        throw "No se recibió token en /auth/login"
    }

    Add-Result -Name "Auth: /auth/login" -Success $true -Details "Token OK para $AdminEmail (role=$($user.role))"
}
catch {
    Add-Result -Name "Auth: /auth/login" -Success $false -Details $_.Exception.Message
}

# 2) AUTH/ME
if ($token) {
    try {
        Write-Host "-> TEST: AUTH/ME"
        $meResponse = Invoke-RestMethod -Uri "$ApiBase/auth/me" -Headers @{ Authorization = "Bearer $token" }
        Add-Result -Name "Auth: /auth/me" -Success $true -Details "Usuario actual: $($meResponse.user.email)"
    }
    catch {
        Add-Result -Name "Auth: /auth/me" -Success $false -Details $_.Exception.Message
    }
}
else {
    Add-Result -Name "Auth: /auth/me" -Success $false -Details "Saltado: no hay token"
}

# 3) UPLOAD
if ($token) {
    if (-not (Test-Path $TestImagePath)) {
        Add-Result -Name "Upload: /upload/image" -Success $false -Details "Saltado: no existe archivo $TestImagePath"
    }
    else {
        try {
            Write-Host "-> TEST: UPLOAD (requiere PowerShell 7+ para -Form)"
            $uploadResponse = Invoke-RestMethod -Uri "$ApiBase/upload/image" `
                -Method Post `
                -Headers @{ Authorization = "Bearer $token" } `
                -Form @{ file = Get-Item $TestImagePath }

            if ($uploadResponse.ok -ne $true -or -not $uploadResponse.url) {
                throw "Respuesta inválida de /upload/image"
            }

            Add-Result -Name "Upload: /upload/image" -Success $true -Details "URL: $($uploadResponse.url)"
        }
        catch {
            Add-Result -Name "Upload: /upload/image" -Success $false -Details $_.Exception.Message
        }
    }
}
else {
    Add-Result -Name "Upload: /upload/image" -Success $false -Details "Saltado: no hay token"
}

# 4) INVENTORY STOCK
if ($token) {
    try {
        Write-Host "-> TEST: INVENTORY STOCK"
        $stockResponse = Invoke-RestMethod -Uri "$ApiBase/inventory/stock" -Headers @{ Authorization = "Bearer $token" }
        $count = 0
        if ($stockResponse.data) {
            $count = $stockResponse.data.Count
        }
        elseif ($stockResponse -is [array]) {
            $count = $stockResponse.Count
        }
        Add-Result -Name "Inventory: /inventory/stock" -Success $true -Details "Items en stock: $count"
    }
    catch {
        Add-Result -Name "Inventory: /inventory/stock" -Success $false -Details $_.Exception.Message
    }
}
else {
    Add-Result -Name "Inventory: /inventory/stock" -Success $false -Details "Saltado: no hay token"
}

# 5) INVENTORY IN (itemId = 1)
if ($token) {
    try {
        Write-Host "-> TEST: INVENTORY IN"
        $bodyIn = @{
            itemId   = 1
            quantity = 2
            unitCost = 30
        } | ConvertTo-Json

        $inResponse = Invoke-RestMethod -Uri "$ApiBase/inventory/in" `
            -Method Post `
            -Headers @{ Authorization = "Bearer $token" } `
            -ContentType "application/json" `
            -Body $bodyIn

        Add-Result -Name "Inventory: /inventory/in" -Success $true -Details "Entrada OK para itemId=1, qty=2"
    }
    catch {
        Add-Result -Name "Inventory: /inventory/in" -Success $false -Details $_.Exception.Message
    }
}
else {
    Add-Result -Name "Inventory: /inventory/in" -Success $false -Details "Saltado: no hay token"
}

# 6) INVENTORY OUT (itemId = 1)
if ($token) {
    try {
        Write-Host "-> TEST: INVENTORY OUT"
        $bodyOut = @{
            itemId   = 1
            quantity = 1
        } | ConvertTo-Json

        $outResponse = Invoke-RestMethod -Uri "$ApiBase/inventory/out" `
            -Method Post `
            -Headers @{ Authorization = "Bearer $token" } `
            -ContentType "application/json" `
            -Body $bodyOut

        Add-Result -Name "Inventory: /inventory/out" -Success $true -Details "Salida OK para itemId=1, qty=1"
    }
    catch {
        Add-Result -Name "Inventory: /inventory/out" -Success $false -Details $_.Exception.Message
    }
}
else {
    Add-Result -Name "Inventory: /inventory/out" -Success $false -Details "Saltado: no hay token"
}

# 7) FIGMA WEBHOOK
$whSecret = $env:WEBHOOK_SECRET

if (-not $whSecret) {
    Add-Result -Name "Webhook: /webhooks/inventory" -Success $false -Details "Saltado: no está definida env WEBHOOK_SECRET"
}
else {
    try {
        Write-Host "-> TEST: FIGMA WEBHOOK"
        $bodyWebhook = @{
            sku        = "CORN-BLUE"
            adjustment = -1
        } | ConvertTo-Json

        $whResponse = Invoke-RestMethod -Uri "$ApiBase/webhooks/inventory" `
            -Method Post `
            -Headers @{ "X-Webhook-Secret" = $whSecret } `
            -ContentType "application/json" `
            -Body $bodyWebhook

        Add-Result -Name "Webhook: /webhooks/inventory" -Success $true -Details "Ajuste -1 para sku=CORN-BLUE"
    }
    catch {
        Add-Result -Name "Webhook: /webhooks/inventory" -Success $false -Details $_.Exception.Message
    }
}

# === RESUMEN Y REPORTES ===

$total   = $results.Count
$passed  = ($results | Where-Object { $_.Success -eq $true }).Count
$failed  = $total - $passed

Write-Host ""
Write-Host "=== RESUMEN QA ==="
Write-Host "Total pruebas: $total"
Write-Host "OK:           $passed"
Write-Host "FAIL:         $failed"

$timestamp = (Get-Date).ToString("yyyyMMdd-HHmmss")
$reportDir = "qa-reports"

if (-not (Test-Path $reportDir)) {
    New-Item -ItemType Directory -Path $reportDir | Out-Null
}

$jsonPath = Join-Path $reportDir "qa-report-$timestamp.json"
$htmlPath = Join-Path $reportDir "qa-report-$timestamp.html"

$results | ConvertTo-Json -Depth 4 | Out-File -FilePath $jsonPath -Encoding UTF8

# HTML
$html = @"
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>QA Report $timestamp</title>
<style>
body { font-family: system-ui, sans-serif; margin: 20px; }
table { border-collapse: collapse; width: 100%; margin-top: 10px; }
th, td { border: 1px solid #ddd; padding: 8px; font-size: 13px; }
th { background: #f4f4f4; text-align: left; }
tr.ok { background: #e7f9ee; }
tr.fail { background: #fde8e8; }
</style>
</head>
<body>
<h1>QA Report – MaizUrbano</h1>
<p><strong>Fecha:</strong> $((Get-Date).ToString("s"))</p>
<p><strong>API:</strong> $ApiBase</p>
<p><strong>Total:</strong> $total &nbsp;&nbsp; <strong>OK:</strong> $passed &nbsp;&nbsp; <strong>FAIL:</strong> $failed</p>
<table>
<thead>
<tr>
<th>Prueba</th>
<th>Estado</th>
<th>Detalle</th>
<th>Hora</th>
</tr>
</thead>
<tbody>
"@

foreach ($r in $results) {
    $cls = if ($r.Success) { "ok" } else { "fail" }
    $status = if ($r.Success) { "OK" } else { "FAIL" }
    $detailsEscaped = [System.Web.HttpUtility]::HtmlEncode($r.Details)
    $nameEscaped = [System.Web.HttpUtility]::HtmlEncode($r.Name)

    $html += "<tr class=""$cls""><td>$nameEscaped</td><td>$status</td><td>$detailsEscaped</td><td>$($r.Time)</td></tr>`n"
}

$html += @"
</tbody>
</table>
</body>
</html>
"@

$html | Out-File -FilePath $htmlPath -Encoding UTF8

Write-Host ""
Write-Host "Reportes generados:"
Write-Host "JSON: $jsonPath"
Write-Host "HTML: $htmlPath"
Write-Host ""
Write-Host "Abre el HTML en el navegador para revisar el QA."
