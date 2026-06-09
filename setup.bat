@echo off
echo ====================================
echo  Valle Mezquital - Sistema de Gestion
echo ====================================
echo.
echo Instalando dependencias...
echo.

cd backend
call npm install
cd ..

cd frontend
call npm install
cd ..

echo.
echo ====================================
echo  Instalacion completada!
echo ====================================
echo.
echo IMPORTANTE:
echo 1. Configura backend/.env con tus credenciales de SQL Server
echo 2. Asegurate de que SQL Server este corriendo
echo.
echo Para iniciar el sistema ejecuta: npm run dev
echo.
pause
