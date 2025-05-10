const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Iniciando preparación para subir a GitHub...');

try {
  // Verificar si Git está inicializado
  if (!fs.existsSync(path.join(process.cwd(), '.git'))) {
    console.log('Inicializando repositorio Git...');
    execSync('git init', { stdio: 'inherit' });
  }

  // Crear archivo .gitignore
  console.log('Creando archivo .gitignore...');
  const gitignoreContent = `# Dependencias
/node_modules
/.pnp
.pnp.js

# Archivos de producción
/dist
/build

# Archivos de entorno
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
logs
*.log

# Directorio de caché
.cache/

# Editor
.idea/
.vscode/
*.swp
*.swo

# Sistema operativo
.DS_Store
Thumbs.db
`;

  fs.writeFileSync(path.join(process.cwd(), '.gitignore'), gitignoreContent);

  // Añadir archivos al repositorio
  console.log('Añadiendo archivos al repositorio...');
  execSync('git add .', { stdio: 'inherit' });

  // Realizar el primer commit
  console.log('Realizando commit inicial...');
  execSync('git commit -m "Commit inicial del proyecto WebSAP"', { stdio: 'inherit' });

  // Configurar el repositorio remoto
  console.log('Configurando repositorio remoto...');
  execSync('git remote add origin https://github.com/alexjfj20/websapchef.git', { stdio: 'inherit' });

  // Subir al repositorio
  console.log('Subiendo archivos a GitHub...');
  try {
    execSync('git push -u origin master', { stdio: 'inherit' });
  } catch (error) {
    console.log('Intentando subir a la rama main...');
    execSync('git push -u origin main', { stdio: 'inherit' });
  }

  console.log('¡Proceso completado! El proyecto ha sido subido a https://github.com/alexjfj20/websapchef.git');
  console.log('Si es la primera vez que usas Git desde este equipo, es posible que te solicite credenciales de GitHub.');
} catch (error) {
  console.error('Ocurrió un error:', error.message);
  process.exit(1);
}