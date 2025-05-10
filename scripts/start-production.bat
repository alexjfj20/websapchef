@echo off
echo Iniciando entorno de produccion para WebSAP...

echo Verificando si Caddy esta instalado...
where caddy >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Caddy no esta instalado. Por favor, instala Caddy primero.
    echo Visita https://caddyserver.com/docs/install para instrucciones.
    exit /b 1
)

echo Deteniendo instancias previas de Caddy...
taskkill /F /IM caddy.exe >nul 2>nul

echo Iniciando Caddy...
cd C:\www\websap
start "" caddy run --config Caddyfile

echo Esperando a que Caddy inicie completamente...
timeout /t 3 /nobreak >nul

echo Deteniendo instancias previas de la aplicacion...
call pm2 stop websap >nul 2>nul

echo Iniciando aplicacion WebSAP...
cd C:\www\websap
set NODE_ENV=production
call pm2 start backend/server.js --name websap

echo Verificando estado de PM2...
call pm2 status

echo Entorno de produccion iniciado correctamente!
echo La aplicacion esta disponible en http://93.127.129.46