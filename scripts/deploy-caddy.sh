#!/bin/bash

# Script para desplegar WebSAP en un VPS con Caddy
echo "Iniciando despliegue de WebSAP con Caddy..."

# Detener la aplicación anterior si está en ejecución con PM2
echo "Deteniendo la aplicación anterior..."
pm2 stop websap 2>/dev/null || true

# Copiar Caddyfile al directorio correcto (ajustar según sea necesario)
echo "Configurando Caddy..."
sudo cp Caddyfile /etc/caddy/Caddyfile

# Reiniciar Caddy para aplicar la nueva configuración
echo "Reiniciando Caddy..."
sudo systemctl reload caddy

# Iniciar la aplicación con PM2
echo "Iniciando la aplicación con PM2..."
cd /ruta/a/tu/aplicacion
NODE_ENV=production pm2 start backend/server.js --name websap

echo "¡Despliegue completado! Tu aplicación está disponible en http://93.127.129.46"
echo "Para verificar el estado: pm2 status websap"