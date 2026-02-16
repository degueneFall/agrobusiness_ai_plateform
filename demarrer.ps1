# Script pour demarrer le projet Agribusiness AI Platform
# Executer depuis la racine du projet (agribusiness-ai-platform)

Write-Host "Demarrage du backend (NestJS)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; npm run start:dev"

Start-Sleep -Seconds 2

Write-Host "Demarrage du frontend (Vite)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev"

Write-Host ""
Write-Host "Les deux serveurs ont ete lances dans des fenetres separees." -ForegroundColor Green
Write-Host "- Backend (API) : http://localhost:3000" -ForegroundColor Yellow
Write-Host "- Frontend (app) : http://localhost:5173" -ForegroundColor Yellow
Write-Host ""
Write-Host "Ouvrez http://localhost:5173 dans votre navigateur." -ForegroundColor White
