@echo off
chcp 65001 >nul
echo ============================================
echo   Nettoyage et reinstallation - BACKEND
echo ============================================
echo.

cd /d "%~dp0"

echo [1] Suppression de node_modules...
if exist "node_modules" (
    rd /s /q "node_modules" 2>nul
    if exist "node_modules" (
        echo       ECHEC - Dossiers verrouilles (OneDrive ?^)
        echo       Fermez Cursor, pausez OneDrive, puis relancez ce script.
        echo       Ou executez ce .bat en "Administrateur" (clic droit).
        pause
        exit /b 1
    )
)
echo       OK

echo.
echo [2] Suppression de package-lock.json...
if exist "package-lock.json" del /q "package-lock.json"
echo       OK

echo.
echo [3] Nettoyage du cache npm...
call npm cache clean --force 2>nul
echo       OK

echo.
echo [4] Installation des dependances (peut prendre 2-3 min)...
call npm install
if errorlevel 1 (
    echo.
    echo ERREUR lors de npm install. Verifiez votre connexion.
    echo Si erreur EPERM : fermez Cursor, pausez OneDrive, relancez ce .bat
    echo Si erreur ECONNRESET : reessayez plus tard ou autre reseau
    pause
    exit /b 1
)

echo.
echo ============================================
echo   Termine. Vous pouvez lancer: npm run start:dev
echo ============================================
pause
