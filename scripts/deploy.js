const { execSync } = require('child_process');

// Build the frontend application
console.log('Building frontend for production deployment...');
execSync('npm run build', { stdio: 'inherit' });

// Show completion message with next steps
console.log('\n✅ Build completed successfully!');
console.log('\nPasos para desplegar en tu VPS con Caddy:');
console.log('\n1. Copia los siguientes archivos a tu VPS en 93.127.129.46:');
console.log('   - dist/ (carpeta de frontend compilada)');
console.log('   - backend/ (carpeta del servidor)');
console.log('   - package.json');
console.log('   - package-lock.json');
console.log('   - .env');
console.log('   - Caddyfile');
console.log('   - scripts/deploy-caddy.sh');
console.log('\n2. En el VPS, ejecuta:');
console.log('   npm install --production');
console.log('   chmod +x scripts/deploy-caddy.sh');
console.log('   ./scripts/deploy-caddy.sh');
console.log('\n3. Tu aplicación estará disponible en: http://93.127.129.46');