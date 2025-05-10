/**
 * Script para actualizar el repositorio GitHub con los cambios actuales
 * Maneja correctamente los casos de repositorio ya inicializado y remoto ya existente
 */
const { execSync } = require('child_process');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const COMMIT_MESSAGE = process.argv[2] || 'Actualización de WebSAP';
const GITHUB_REPO = 'https://github.com/alexjfj20/websapchef.git'; // Cambiar si es necesario

console.log('===== ACTUALIZACIÓN DE REPOSITORIO GITHUB =====');
process.chdir(ROOT_DIR);

try {  // Comprobar si el repositorio ya está inicializado
  console.log('Verificando estado del repositorio Git...');
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
    console.log('✅ Repositorio Git ya inicializado');
  } catch (e) {
    console.log('Inicializando nuevo repositorio Git...');
    execSync('git init', { stdio: 'inherit' });
  }

  // Verificar si ya existe un remoto configurado
  let remoteExists = false;
  let remoteUrl = '';
  try {
    remoteUrl = execSync('git remote get-url origin', { encoding: 'utf8' }).trim();
    remoteExists = true;
    console.log(`✅ Remoto ya configurado: ${remoteUrl}`);
  } catch (e) {
    console.log('Configurando remoto "origin"...');
    execSync(`git remote add origin ${GITHUB_REPO}`, { stdio: 'inherit' });
  }

  // Si el remoto existe pero la URL es diferente, actualizarla
  if (remoteExists && remoteUrl !== GITHUB_REPO) {
    console.log('Actualizando URL del remoto...');
    execSync(`git remote set-url origin ${GITHUB_REPO}`, { stdio: 'inherit' });
  }

  // Añadir archivos al staging
  console.log('Añadiendo archivos modificados...');
  execSync('git add .', { stdio: 'inherit' });

  // Realizar commit (solo si hay cambios)
  let hasChanges = false;
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    hasChanges = status.trim().length > 0;
  } catch (e) {
    console.log('Error al verificar cambios:', e.message);
  }

  if (hasChanges) {
    console.log(`Realizando commit: "${COMMIT_MESSAGE}"...`);
    try {
      execSync(`git commit -m "${COMMIT_MESSAGE}"`, { stdio: 'inherit' });
    } catch (commitError) {
      console.log('⚠️ No se pudo realizar commit. Posiblemente no hay cambios o se necesita configurar usuario git.');
    }
  } else {
    console.log('ℹ️ No hay cambios para hacer commit');
  }

  // Asegurarse de que estamos en la rama main
  console.log('Cambiando a la rama main...');
  try {
    // Verificar si la rama main existe localmente
    const branches = execSync('git branch', { encoding: 'utf8' });
    if (!branches.includes('main')) {
      execSync('git branch -M main', { stdio: 'inherit' });
    } else {
      execSync('git checkout main', { stdio: 'inherit' });
    }
  } catch (e) {
    console.log('Creando rama main...');
    execSync('git branch -M main', { stdio: 'inherit' });
  }

  // Subir cambios
  console.log('Subiendo cambios a GitHub...');
  execSync('git push -u origin main', { stdio: 'inherit' });

  console.log('\n===== ACTUALIZACIÓN COMPLETADA =====');
  console.log(`✅ Los cambios han sido subidos a ${GITHUB_REPO}`);

} catch (error) {
  console.error('❌ Error durante la actualización:', error.message);
  process.exit(1);
}