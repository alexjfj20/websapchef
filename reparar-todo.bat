@echo off
color 0A
title Reparacion WebSAP
cls
echo ================================================
echo        REPARACION COMPLETA DE WEBSAP
echo ================================================
echo.
echo Este proceso:
echo  1. Instalara las dependencias faltantes
echo  2. Configurara el sistema de logging
echo  3. Reiniciara la aplicacion
echo.
echo ------------------------------------------------
echo.

cd C:\websap
node scripts\fix-all.js

echo.
echo ================================================
echo Proceso completado. Presiona cualquier tecla para salir...
pause > nul