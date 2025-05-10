const { execSync, spawn } = require('child_process');
const path = require('path');
const os = require('os');

// Determinar si estamos en Windows o Linux/Mac
const isWindows = os.platform() === 'win32';
const rootDir = path.resolve(__dirname, '..');

console.log('Iniciando entorno de producción para WebSAP...');

try {
  // Verificar si Caddy está instalado
  try {
    console.log('Verificando si Caddy está instalado...');
    execSync(isWindows ? 'where caddy' : 'which caddy', { stdio: 'ignore' });
  } catch (error) {
    console.error('Caddy no está instalado. Por favor, instala Caddy primero.');
    console.error('Visita https://caddyserver.com/docs/install para instrucciones.');
    process.exit(1);
  }

  // Detener instancias previas de Caddy
  console.log('Deteniendo instancias previas de Caddy...');
  try {
    if (isWindows) {
      execSync('taskkill /F /IM caddy.exe', { stdio: 'ignore' });
    } else {
      execSync('sudo systemctl stop caddy', { stdio: 'ignore' });
    }
  } catch (e) {
    // Es normal que falle si no hay instancias previas
  }

  // Configurar Caddy
  console.log('Configurando Caddy...');
  if (!isWindows) {
    try {
      execSync(`sudo cp ${path.join(rootDir, 'Caddyfile')} /etc/caddy/Caddyfile`);
    } catch (e) {
      console.log('No se pudo copiar Caddyfile a /etc/caddy/, usando el archivo local...');
    }
  }

  // Iniciar Caddy
  console.log('Iniciando Caddy...');
  const caddyProcess = spawn(
    'caddy',
    ['run', '--config', path.join(rootDir, 'Caddyfile')],
    {
      detached: true,
      stdio: 'ignore',
      cwd: rootDir
    }
  );
  caddyProcess.unref();

  // Esperar a que Caddy inicie completamente
  console.log('Esperando a que Caddy inicie completamente...');
  execSync(isWindows ? 'timeout /t 3 /nobreak > nul' : 'sleep 3');

  // Detener la aplicación Node.js si está en ejecución con PM2
  console.log('Deteniendo instancias previas de la aplicación...');
  try {
    execSync('pm2 stop websap', { stdio: 'ignore' });
  } catch (e) {
    // Es normal que falle si la aplicación no está en ejecución
  }

  // Iniciar la aplicación Node.js con PM2
  console.log('Iniciando aplicación WebSAP...');
  process.chdir(rootDir);
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