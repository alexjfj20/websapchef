/**
 * Script para gestionar el entorno completo de WebSAP
 * Permite iniciar, detener y verificar el estado de Caddy y Node.js
 */
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const ROOT_DIR = path.resolve(__dirname, '..');
const CADDY_PATH = 'C:\\Caddy\\caddy.exe'; // Ajusta esta ruta si es diferente
const CADDYFILE_PATH = path.join(ROOT_DIR, 'Caddyfile');

// Procesar argumentos de línea de comandos
const command = process.argv[2] || 'status';

function checkCaddyStatus() {
  console.log('Verificando estado de Caddy...');
  try {
    const tasklistOutput = execSync('tasklist /FI "IMAGENAME eq caddy.exe" /FO CSV /NH', { encoding: 'utf8' });
    if (tasklistOutput.includes('caddy.exe')) {
      console.log('✅ Caddy está en ejecución');
      return true;
    } else {
      console.log('❌ Caddy NO está en ejecución');
      return false;
    }
  } catch (e) {
    console.log('❌ Error al verificar Caddy:', e.message);
    return false;
  }
}

function checkPM2Status() {
  console.log('Verificando estado de WebSAP en PM2...');
  try {
    const pm2Output = execSync('pm2 list', { encoding: 'utf8' });
    if (pm2Output.includes('websap')) {
      console.log('✅ WebSAP está en ejecución con PM2');
      return true;
    } else {
      console.log('❌ WebSAP NO está en ejecución con PM2');
      return false;
    }
  } catch (e) {
    console.log('❌ Error al verificar PM2:', e.message);
    return false;
  }
}

function startCaddy() {
  if (!fs.existsSync(CADDY_PATH)) {
    console.error(`❌ Error: No se encontró Caddy en ${CADDY_PATH}`);
    console.error('Por favor, ajusta la ruta CADDY_PATH en este script.');
    return false;
  }

  if (!fs.existsSync(CADDYFILE_PATH)) {
    console.error(`❌ Error: No se encontró el Caddyfile en ${CADDYFILE_PATH}`);
    return false;
  }

  console.log('Iniciando Caddy...');
  try {
    const caddyProcess = require('child_process').spawn(
      CADDY_PATH,
      ['run', '--config', CADDYFILE_PATH],
      {
        detached: true,
        stdio: 'ignore',
        cwd: ROOT_DIR
      }
    );
    caddyProcess.unref();
    console.log('✅ Caddy iniciado correctamente');
    return true;
  } catch (e) {
    console.error('❌ Error al iniciar Caddy:', e.message);
    return false;
  }
}

function stopCaddy() {
  console.log('Deteniendo Caddy...');
  try {
    execSync('taskkill /F /IM caddy.exe', { stdio: 'inherit' });
    console.log('✅ Caddy detenido correctamente');
    return true;
  } catch (e) {
    console.log('❌ Error al detener Caddy:', e.message);
    return false;
  }
}

function startWebSAP() {
  console.log('Iniciando WebSAP con PM2...');
  try {
    process.chdir(ROOT_DIR);
    process.env.NODE_ENV = 'production';
    execSync('pm2 start backend/server.js --name websap', { stdio: 'inherit' });
    console.log('✅ WebSAP iniciado correctamente');
    return true;
  } catch (e) {
    console.error('❌ Error al iniciar WebSAP:', e.message);
    return false;
  }
}

function stopWebSAP() {
  console.log('Deteniendo WebSAP en PM2...');
  try {
    execSync('pm2 stop websap', { stdio: 'inherit' });
    console.log('✅ WebSAP detenido correctamente');
    return true;
  } catch (e) {
    console.log('❌ Error al detener WebSAP:', e.message);
    return false;
  }
}

function showStatus() {
  console.log('\n===== ESTADO DEL ENTORNO WEBSAP =====\n');
  
  const caddyRunning = checkCaddyStatus();
  const pm2Running = checkPM2Status();
  
  console.log('\n======================================\n');
  
  if (caddyRunning && pm2Running) {
    console.log('✅ ¡El entorno completo está funcionando correctamente!');
    console.log('La aplicación está disponible en http://93.127.129.46');
  } else {
    console.log('⚠️ Hay componentes que no están en ejecución.');
    console.log('Ejecuta `node scripts/manage-websap.js start` para iniciar todo el entorno.');
  }
}

function showHelp() {
  console.log(`
  Gestor de Entorno WebSAP
  ========================
  
  Uso: node scripts/manage-websap.js [comando]
  
  Comandos disponibles:
    start       - Inicia todo el entorno (Caddy y WebSAP)
    stop        - Detiene todo el entorno
    restart     - Reinicia todo el entorno
    status      - Muestra el estado actual del entorno (predeterminado)
    start:caddy - Inicia solo Caddy
    stop:caddy  - Detiene solo Caddy
    start:app   - Inicia solo la aplicación WebSAP
    stop:app    - Detiene solo la aplicación WebSAP
    help        - Muestra esta ayuda
  `);
}

// Ejecutar el comando seleccionado
switch (command.toLowerCase()) {
  case 'start':
    console.log('Iniciando todo el entorno WebSAP...');
    if (!checkCaddyStatus()) startCaddy();
    if (!checkPM2Status()) startWebSAP();
    showStatus();
    break;
  
  case 'stop':
    console.log('Deteniendo todo el entorno WebSAP...');
    stopWebSAP();
    stopCaddy();
    showStatus();
    break;
  
  case 'restart':
    console.log('Reiniciando todo el entorno WebSAP...');
    stopWebSAP();
    stopCaddy();
    startCaddy();
    // Esperar a que Caddy inicie completamente
    execSync('timeout /t 3 /nobreak > nul');
    startWebSAP();
    showStatus();
    break;
  
  case 'status':
    showStatus();
    break;
  
  case 'start:caddy':
    if (!checkCaddyStatus()) startCaddy();
    break;
  
  case 'stop:caddy':
    stopCaddy();
    break;
  
  case 'start:app':
    if (!checkPM2Status()) startWebSAP();
    break;
  
  case 'stop:app':
    stopWebSAP();
    break;
  
  case 'help':
  default:
    showHelp();
    break;
}