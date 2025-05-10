const { execSync, spawn } = require('child_process');
const path = require('path');
const os = require('os');
const fs = require('fs');

// Determinar si estamos en Windows o Linux/Mac
const isWindows = os.platform() === 'win32';
const rootDir = path.resolve(__dirname, '..');

console.log('Iniciando entorno de producción para WebSAP...');

try {
  // Verificar si Caddy está instalado o disponible
  console.log('Verificando si Caddy está disponible...');
  
  // Primero, intentar encontrar Caddy en la ruta especificada
  const caddyPaths = [
    'C:\\Caddy\\caddy.exe',
    'C:\\caddy\\caddy.exe',
    'C:\\Program Files\\Caddy\\caddy.exe',
    'C:\\www\\caddy.exe',
    path.join(rootDir, 'caddy.exe')
  ];
  
  let caddyPath = null;
  
  // Comprobar si existe en alguna de las rutas comunes
  for (const potentialPath of caddyPaths) {
    if (fs.existsSync(potentialPath)) {
      caddyPath = potentialPath;
      console.log(`Caddy encontrado en: ${caddyPath}`);
      break;
    }
  }
  
  // Si no se encuentra en las rutas comunes, intentar con where/which
  if (!caddyPath) {
    try {
      const whereResult = execSync(isWindows ? 'where caddy' : 'which caddy', { encoding: 'utf8' }).trim();
      if (whereResult) {
        caddyPath = whereResult;
        console.log(`Caddy encontrado en PATH: ${caddyPath}`);
      }
    } catch (error) {
      console.warn('Caddy no encontrado en PATH del sistema');
    }
  }
  
  if (!caddyPath) {
    console.error('No se pudo encontrar Caddy. Por favor, asegúrate de que esté instalado.');
    console.error('Visita https://caddyserver.com/docs/install para instrucciones.');
    console.error('O especifica la ruta completa a caddy.exe en este script.');
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
  
  // Comprobar si existe el archivo Caddyfile
  const caddyfilePath = path.join(rootDir, 'Caddyfile');
  if (!fs.existsSync(caddyfilePath)) {
    console.error(`Error: No se encontró el archivo Caddyfile en ${caddyfilePath}`);
    console.error('Creando un Caddyfile básico...');
    
    // Crear un Caddyfile básico si no existe
    const basicCaddyfile = `93.127.129.46 {
  reverse_proxy localhost:3000
}`;
    fs.writeFileSync(caddyfilePath, basicCaddyfile);
    console.log(`Se ha creado un Caddyfile básico en ${caddyfilePath}`);
  }
  
  console.log(`Ejecutando: ${caddyPath} run --config ${caddyfilePath}`);
  const caddyProcess = spawn(
    caddyPath,
    ['run', '--config', caddyfilePath],
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