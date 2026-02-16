# Fix npm install - erreurs EPERM (OneDrive) et ECONNRESET (reseau)
# Executer ce script dans PowerShell (clic droit -> Executer avec PowerShell)
# de preference en fermant Cursor et tout programme qui utilise le projet.

$ErrorActionPreference = "Stop"

Write-Host "=== Nettoyage et reinstallation des dependances ===" -ForegroundColor Cyan
Write-Host ""

$root = $PSScriptRoot

# 1. Nettoyer le cache npm (aide en cas de reseau instable)
Write-Host "[1/4] Nettoyage du cache npm..." -ForegroundColor Yellow
npm cache clean --force 2>$null
Write-Host "      OK" -ForegroundColor Green

# 2. Backend
Write-Host ""
Write-Host "[2/4] Backend - suppression node_modules et package-lock.json..." -ForegroundColor Yellow
$backend = Join-Path $root "backend"
if (Test-Path (Join-Path $backend "node_modules")) {
    Remove-Item (Join-Path $backend "node_modules") -Recurse -Force -ErrorAction SilentlyContinue
}
if (Test-Path (Join-Path $backend "package-lock.json")) {
    Remove-Item (Join-Path $backend "package-lock.json") -Force
}
Write-Host "      OK" -ForegroundColor Green

Write-Host "      Installation des dependances backend..." -ForegroundColor Yellow
Set-Location $backend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "      ERREUR backend. Voir messages ci-dessus." -ForegroundColor Red
    Set-Location $root
    exit 1
}
Write-Host "      Backend OK" -ForegroundColor Green
Set-Location $root

# 3. Frontend
Write-Host ""
Write-Host "[3/4] Frontend - suppression node_modules et package-lock.json..." -ForegroundColor Yellow
$frontend = Join-Path $root "frontend"
if (Test-Path (Join-Path $frontend "node_modules")) {
    Remove-Item (Join-Path $frontend "node_modules") -Recurse -Force -ErrorAction SilentlyContinue
}
if (Test-Path (Join-Path $frontend "package-lock.json")) {
    Remove-Item (Join-Path $frontend "package-lock.json") -Force
}
Write-Host "      OK" -ForegroundColor Green

Write-Host "      Installation des dependances frontend..." -ForegroundColor Yellow
Set-Location $frontend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "      ERREUR frontend. Voir messages ci-dessus." -ForegroundColor Red
    Set-Location $root
    exit 1
}
Write-Host "      Frontend OK" -ForegroundColor Green
Set-Location $root

Write-Host ""
Write-Host "[4/4] Termine avec succes." -ForegroundColor Green
Write-Host ""
Write-Host "Vous pouvez maintenant:" -ForegroundColor White
Write-Host "  - Backend :  cd backend  puis  npm run start:dev" -ForegroundColor Cyan
Write-Host "  - Frontend: cd frontend puis  npm run dev" -ForegroundColor Cyan
Write-Host ""
Read-Host "Appuyez sur Entree pour fermer"
