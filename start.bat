@echo off
cls
echo ====================================
echo  Valle Mezquital - Iniciando Sistema
echo ====================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Credenciales Delegado:
echo Email: delegado@mezquital.mx
echo Pass: Delegado123*
echo.
echo ====================================
echo.

start cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul
start cmd /k "cd frontend && npm run dev"

echo Sistema iniciado en 2 ventanas
echo.
pause
