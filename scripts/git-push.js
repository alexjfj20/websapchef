const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Iniciando actualización del repositorio GitHub...');

try {
  // Verificar si Git está inicializado
  if (!fs.existsSync(path.join(process.cwd(), '.git'))) {
    console.log('Inicializando repositorio Git...');
    execSync('git init', { stdio: 'inherit' });
  }

  // Crear archivo .gitignore si no existe
  if (!fs.existsSync(path.join(process.cwd(), '.gitignore'))) {
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
  }

  // Verificar si el remoto ya existe
  let remoteExists = false;
  try {
    execSync('git remote get-url origin', { stdio: 'pipe' });
    remoteExists = true;
  } catch (e) {
    // El remote no existe aún
  }

  if (!remoteExists) {
    // Configurar el repositorio remoto
    console.log('Configurando repositorio remoto...');
    execSync('git remote add origin https://github.com/alexjfj20/websapchef.git', { stdio: 'inherit' });
  }

  // Añadir archivos al repositorio
  console.log('Añadiendo archivos al repositorio...');
  execSync('git add .', { stdio: 'inherit' });

  // Realizar commit con mensaje descriptivo
  console.log('Realizando commit con los cambios...');
  const commitMessage = 'Actualización de configuración para producción y despliegue con Caddy';
  execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
  // Subir al repositorio
  console.log('Subiendo cambios a GitHub...');
  try {
    execSync('git push -u origin master', { stdio: 'inherit' });
  } catch (error) {
    console.log('Intentando subir a la rama main...');
    try {
      execSync('git push -u origin main', { stdio: 'inherit' });
    } catch (mainError) {
      console.error('Error al subir a GitHub:', mainError.message);
      throw mainError;
    }
  }

  console.log('¡Repositorio actualizado correctamente!');
  console.log('Los cambios han sido subidos a https://github.com/alexjfj20/websapchef.git');
} catch (error) {
  console.error('Ocurrió un error al actualizar el repositorio:', error.message);
  process.exit(1);
}