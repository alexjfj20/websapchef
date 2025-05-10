#!/bin/bash

# Script para iniciar Caddy y la aplicación WebSAP en producción
echo "Iniciando entorno de producción para WebSAP..."

# Detener instancias previas de Caddy (si existen)
echo "Deteniendo instancias previas de Caddy..."
sudo systemctl stop caddy 2>/dev/null || true

# Copiar el archivo Caddyfile a la ubicación correcta
echo "Configurando Caddy..."
sudo cp ../Caddyfile /etc/caddy/Caddyfile

# Iniciar Caddy
echo "Iniciando Caddy..."
sudo systemctl start caddy

# Verificar el estado de Caddy
echo "Verificando estado de Caddy..."
sudo systemctl status caddy --no-pager

# Detener la aplicación Node.js si está en ejecución con PM2
echo "Deteniendo instancias previas de la aplicación..."
pm2 stop websap 2>/dev/null || true

# Iniciar la aplicación Node.js con PM2
echo "Iniciando aplicación WebSAP..."
cd ..
NODE_ENV=production pm2 start backend/server.js --name websap

# Verificar el estado de PM2
echo "Verificando estado de PM2..."
pm2 status

echo "¡Entorno de producción iniciado correctamente!"
echo "La aplicación está disponible en http://93.127.129.46"