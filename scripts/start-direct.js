/**
 * Script directo para iniciar WebSAP con Caddy usando rutas exactas
 */
const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configuración específica para tu VPS
const CADDY_PATH = 'C:\\Caddy\\caddy.exe'; // Ajusta esta ruta si es diferente
const ROOT_DIR = path.resolve(__dirname, '..');
const CADDYFILE_PATH = path.join(ROOT_DIR, 'Caddyfile');

console.log('Iniciando WebSAP con configuración específica para este VPS...');

try {
  // Verificar si existe el Caddyfile
  if (!fs.existsSync(CADDYFILE_PATH)) {
    console.error(`Error: No se encontró el Caddyfile en ${CADDYFILE_PATH}`);
    process.exit(1);
  }

  // Verificar si existe el ejecutable de Caddy
  if (!fs.existsSync(CADDY_PATH)) {
    console.error(`Error: No se encontró Caddy en ${CADDY_PATH}`);
    console.error('Por favor, ajusta la ruta CADDY_PATH en este script.');
    process.exit(1);
  }
  
  // Verificar si Caddy ya está en ejecución
  console.log('Verificando si Caddy ya está en ejecución...');
  let caddyRunning = false;
  try {
    const tasklistOutput = execSync('tasklist /FI "IMAGENAME eq caddy.exe" /FO CSV /NH', { encoding: 'utf8' });
    if (tasklistOutput.includes('caddy.exe')) {
      console.log('Caddy ya está en ejecución. No es necesario reiniciarlo.');
      caddyRunning = true;
    }
  } catch (e) {
    console.log('Error al verificar si Caddy está en ejecución:', e.message);
  }

  if (!caddyRunning) {
    // Detener cualquier instancia anterior de Caddy por si acaso
    console.log('Deteniendo instancias previas de Caddy...');
    try {
      execSync('taskkill /F /IM caddy.exe 2>nul', { stdio: 'ignore' });
      console.log('Instancias previas de Caddy detenidas.');
    } catch (e) {
      // Es normal que falle si no hay instancias previas
      console.log('No se encontraron instancias previas de Caddy.');
    }

    // Iniciar Caddy con la ruta específica
    console.log(`Iniciando Caddy desde ${CADDY_PATH} con el Caddyfile en ${CADDYFILE_PATH}`);
    const caddyProcess = spawn(
      CADDY_PATH,
      ['run', '--config', CADDYFILE_PATH],
      {
        detached: true,
        stdio: 'ignore',
        cwd: ROOT_DIR
      }
    );
    caddyProcess.unref();
    
    // Esperar a que Caddy inicie completamente
    console.log('Esperando a que Caddy inicie completamente...');
    execSync('timeout /t 3 /nobreak > nul');
  }
  
  // Esperar a que Caddy inicie completamente
  console.log('Esperando a que Caddy inicie completamente...');
  execSync('timeout /t 3 /nobreak > nul');

  // Detener cualquier instancia anterior de la aplicación en PM2
  console.log('Deteniendo instancias previas de WebSAP en PM2...');
  try {
    execSync('pm2 stop websap', { stdio: 'ignore' });
    console.log('Instancia previa de WebSAP detenida en PM2.');
  } catch (e) {
    // Es normal que falle si la aplicación no está en ejecución
    console.log('No se encontró instancia previa de WebSAP en PM2.');
  }

  // Iniciar la aplicación Node.js con PM2
  console.log('Iniciando aplicación WebSAP con PM2...');
  process.chdir(ROOT_DIR);
  process.env.NODE_ENV = 'production';
  execSync('pm2 start backend/server.js --name websap', { stdio: 'inherit' });

  // Verificar el estado de PM2
  console.log('Verificando estado de PM2...');
  execSync('pm2 status', { stdio: 'inherit' });

  console.log('¡Entorno de producción iniciado correctamente!');
  console.log('La aplicación está disponible en http://93.127.129.46');
  
} catch (error) {
  console.error('Error al iniciar el entorno de producción:', error.message);
  process.exit(1);
}