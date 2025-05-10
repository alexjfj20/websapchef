@echo off
title WebSAP Manager
echo WebSAP - Gestor de Entorno

IF "%~1"=="" (
    goto :menu
) ELSE (
    node scripts\manage-websap.js %1
    pause
    exit /b
)

:menu
cls
echo.
echo  =================================
echo    GESTOR DE ENTORNO WEBSAP
echo  =================================
echo.
echo  1. Iniciar todo (Caddy + Node.js)
echo  2. Detener todo
echo  3. Reiniciar todo
echo  4. Ver estado
echo  5. Iniciar solo Caddy
echo  6. Detener solo Caddy
echo  7. Iniciar solo WebSAP
echo  8. Detener solo WebSAP
echo  9. Salir
echo.
echo =================================
echo.

set /p option="Seleccione una opcion: "

IF "%option%"=="1" (
    node scripts\manage-websap.js start
) ELSE IF "%option%"=="2" (
    node scripts\manage-websap.js stop
) ELSE IF "%option%"=="3" (
    node scripts\manage-websap.js restart
) ELSE IF "%option%"=="4" (
    node scripts\manage-websap.js status
) ELSE IF "%option%"=="5" (
    node scripts\manage-websap.js start:caddy
) ELSE IF "%option%"=="6" (
    node scripts\manage-websap.js stop:caddy
) ELSE IF "%option%"=="7" (
    node scripts\manage-websap.js start:app
) ELSE IF "%option%"=="8" (
    node scripts\manage-websap.js stop:app
) ELSE IF "%option%"=="9" (
    exit /b
) ELSE (
    echo Opcion no valida
)

pause
goto :menu