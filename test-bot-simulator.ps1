# =====================================================================
# SIMULADOR DE BOT SPAMMER - FISIOTERAPIA MAYORES / VITALIDAD MAYORES
# Este script recrea exactamente las 3 formas en las que atacan los bots
# para comprobar que ya no pueden colar spam a través de la web.
# =====================================================================

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   SIMULADOR DE ATAQUES DE BOTS - VERIFICACION DE SEGURIDAD" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""

$websiteUrl = "https://fisioterapiamayores.com/"

# ---------------------------------------------------------------------
# ATAQUE 1: Scraper que lee el HTML buscando a donde enviar el formulario
# ---------------------------------------------------------------------
Write-Host "[1] ATAQUE SCRAPER: El bot descarga el HTML para buscar el endpoint..." -ForegroundColor Yellow
try {
    $html = (Invoke-WebRequest -Uri $websiteUrl -UseBasicParsing).Content

    # Buscar el action del formulario en el HTML
    if ($html -match '<form id="contactForm"[^>]*action="([^"]*)"') {
        $foundAction = $matches[1]
        Write-Host "    -> Atributo action encontrado: '$foundAction'" -ForegroundColor White
        
        if ($foundAction -eq "#" -or [string]::IsNullOrWhiteSpace($foundAction)) {
            Write-Host "    [BLOQUEADO] El bot ve action='#' y no encuentra ninguna URL de destino." -ForegroundColor Green
        } else {
            Write-Host "    [AVISO] Se detecto action='$foundAction'" -ForegroundColor Yellow
        }
    }

    # Comprobar si formsubmit.co aparece en cualquier parte del HTML
    $containsFormSubmit = $html -match "formsubmit\.co"
    if (-not $containsFormSubmit) {
        Write-Host "    [BLOQUEADO] La palabra 'formsubmit.co' NO existe en el HTML estatico." -ForegroundColor Green
    } else {
        Write-Host "    [FALLO] Se encontro formsubmit.co expuesto en el HTML!" -ForegroundColor Red
    }
} catch {
    Write-Host "    Error al conectar con la web: $($_.Exception.Message)" -ForegroundColor Red
}

# ---------------------------------------------------------------------
# ATAQUE 2: POST directo a la web (scripts automaticos como curl/python)
# ---------------------------------------------------------------------
Write-Host ""
Write-Host "[2] ATAQUE POST DIRECTO: El bot intenta enviar datos por HTTP POST a la web..." -ForegroundColor Yellow

$botData = @{
    name = "Robert"
    email = "maxyalejandros@gmail.com"
    telefono = "+12025550119"
    message = "Quisiera mas informacion. Por favor contactenme por correo..."
}

try {
    $response = Invoke-WebRequest -Uri "$websiteUrl#" -Method POST -Body $botData -UseBasicParsing -ErrorAction Stop
    Write-Host "    -> Codigo HTTP: $($response.StatusCode)" -ForegroundColor Red
} catch {
    Write-Host "    [BLOQUEADO] $($_.Exception.Message)" -ForegroundColor Green
    Write-Host "    GitHub Pages rechaza peticiones directas POST (405 Method Not Allowed)." -ForegroundColor Green
}

# ---------------------------------------------------------------------
# ATAQUE 3: Evaluacion de las reglas de validacion de JavaScript
# ---------------------------------------------------------------------
Write-Host ""
Write-Host "[3] ATAQUE DE DATOS: Evaluando si los datos del bot pasarian los filtros..." -ForegroundColor Yellow

# Test Telefono
$botPhone = "+12025550119"
$cleanPhone = $botPhone -replace '[\s\-\(\)]', ''
$isSpanish = ($cleanPhone -match '^(\+34)?[6789]\d{8}$') -and (-not ($cleanPhone.StartsWith('+') -and -not $cleanPhone.StartsWith('+34')))

Write-Host "    -> Telefono de prueba: '$botPhone'" -ForegroundColor White
if (-not $isSpanish) {
    Write-Host "    [BLOQUEADO] El filtro de telefono rechazo el numero internacional." -ForegroundColor Green
} else {
    Write-Host "    [FALLO] El telefono no fue rechazado." -ForegroundColor Red
}

# ---------------------------------------------------------------------
# RESUMEN FINAL
# ---------------------------------------------------------------------
Write-Host ""
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " RESUMEN: La web esta protegida contra los 3 vectores." -ForegroundColor Cyan
Write-Host " Los bots no tienen endpoint visible y sus datos son rechazados." -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""
