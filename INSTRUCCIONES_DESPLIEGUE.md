# Instrucciones de Despliegue para WebSAP con Caddy

Este documento contiene instrucciones detalladas para desplegar la aplicación WebSAP en un VPS usando Caddy como servidor web/proxy.

## Preparación Local

1. Compilar la aplicación:
   ```
   npm run build
   ```

2. Archivos a transferir al VPS:
   - Carpeta `dist/` (frontend compilado)
   - Carpeta `backend/` (código del servidor)
   - `package.json` y `package-lock.json`
   - `.env` (asegúrate de configurar las variables correctamente)
   - `Caddyfile`
   - `scripts/deploy-caddy.sh`

## Configuración en el VPS (93.127.129.46)

1. Asegúrate de tener Caddy instalado:
   ```
   # En Ubuntu/Debian
   sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
   curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
   curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
   sudo apt update
   sudo apt install caddy
   ```

2. Crea una carpeta para la aplicación:
   ```
   mkdir -p /var/www/websap
   ```

3. Transfiere los archivos a esta carpeta (usa SCP, SFTP o el método que prefieras)

4. Navega a la carpeta de la aplicación:
   ```
   cd /var/www/websap
   ```

5. Instala las dependencias de producción:
   ```
   npm install --production
   ```

6. Configura los permisos para el script de despliegue:
   ```
   chmod +x scripts/deploy-caddy.sh
   ```

7. Copia el archivo Caddyfile al directorio de configuración de Caddy:
   ```
   sudo cp Caddyfile /etc/caddy/Caddyfile
   ```

8. Reinicia Caddy para aplicar la configuración:
   ```
   sudo systemctl reload caddy
   ```

9. Instala PM2 si no lo tienes:
   ```
   npm install -g pm2
   ```

10. Inicia la aplicación con PM2:
    ```
    NODE_ENV=production pm2 start backend/server.js --name websap
    ```

11. Configura PM2 para iniciar automáticamente después de un reinicio:
    ```
    pm2 startup
    pm2 save
    ```

## Mantenimiento

- Para verificar el estado de la aplicación:
  ```
  pm2 status websap
  ```

- Para ver los logs de la aplicación:
  ```
  pm2 logs websap
  ```

- Para reiniciar la aplicación:
  ```
  pm2 restart websap
  ```

- Para verificar el estado de Caddy:
  ```
  sudo systemctl status caddy
  ```

- Los logs de Caddy se encuentran en:
  ```
  /var/log/caddy/websap.log
  ```

## Solución de problemas

- Si hay problemas con Caddy, verifica los logs:
  ```
  sudo journalctl -u caddy
  ```

- Si necesitas abrir el puerto 80/443 en el firewall:
  ```
  sudo ufw allow 80/tcp
  sudo ufw allow 443/tcp
  ```

- Si la aplicación no inicia, verifica los logs de PM2:
  ```
  pm2 logs websap
  ```