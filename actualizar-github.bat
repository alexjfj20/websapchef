@echo off
title Actualizar GitHub
color 0E
cls
echo ============================================
echo     ACTUALIZACION DEL REPOSITORIO GITHUB
echo ============================================
echo.
echo Este script subira todos los cambios actuales
echo a tu repositorio GitHub de forma automatica.
echo.

set /p mensaje="Ingresa el mensaje del commit (o presiona Enter para usar uno predeterminado): "

cd C:\websap

IF "%mensaje%"=="" (
  node scripts\update-github.js
) ELSE (
  node scripts\update-github.js "%mensaje%"
)

echo.
echo Presiona cualquier tecla para salir...
pause > nul