/**
 * Script para solucionar todos los problemas de la aplicación WebSAP
 * - Instala dependencias faltantes
 * - Crea archivos de configuración necesarios
 * - Reinicia la aplicación
 */
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('===== REPARACIÓN COMPLETA DE WEBSAP =====');

try {
  // 1. Arreglar las dependencias
  console.log('\n[PASO 1/3] Instalando dependencias faltantes...');
  try {
    // Lista de dependencias que pueden ser necesarias
    const dependencies = [
      'winston',          // Sistema de logging
      'winston-daily-rotate-file', // Rotación de logs
      'moment',           // Manejo de fechas
      'moment-timezone',  // Zonas horarias
      'pm2'               // Gestor de procesos (global)
    ];

    console.log('Instalando dependencias necesarias...');
    try {
      execSync(`npm install --save ${dependencies.join(' ')}`, {
        stdio: 'inherit',
        cwd: path.resolve(__dirname, '..')
      });
      console.log('✅ Dependencias instaladas correctamente');
    } catch (e) {
      console.error('❌ Error al instalar dependencias:', e.message);
    }

    // Verificar que PM2 esté instalado globalmente
    console.log('Verificando instalación de PM2...');
    try {
      execSync('pm2 --version', { stdio: 'ignore' });
      console.log('✅ PM2 ya está instalado globalmente');
    } catch (e) {
      console.log('⚠️ PM2 no está instalado globalmente, instalándolo...');
      try {
        execSync('npm install -g pm2', { stdio: 'inherit' });
        console.log('✅ PM2 instalado globalmente');
      } catch (pmError) {
        console.error('❌ Error al instalar PM2 globalmente:', pmError.message);
      }
    }
  } catch (e) {
    console.error('⚠️ Error al instalar dependencias:', e.message);
  }

  // 2. Arreglar la configuración de logger
  console.log('\n[PASO 2/3] Verificando configuración de logger...');
  try {
    const loggerPath = path.join(__dirname, '..', 'backend', 'config', 'logger.js');
    const configDir = path.join(__dirname, '..', 'backend', 'config');

    // Verificar si existe el directorio config
    if (!fs.existsSync(configDir)) {
      console.log(`Creando directorio: ${configDir}`);
      fs.mkdirSync(configDir, { recursive: true });
    }

    // Verificar si existe el archivo logger.js
    if (!fs.existsSync(loggerPath)) {
      console.log(`No se encontró el archivo logger.js en ${loggerPath}`);
      console.log('Creando una implementación básica de logger...');
      
      // Contenido básico para el logger
      const loggerContent = `const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Asegurarse de que el directorio de logs exista
const logDir = path.join(__dirname, '..', '..', 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Configuración de formato para los logs
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(info => \`\${info.timestamp} \${info.level}: \${info.message}\`)
);

// Crear logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  transports: [
    // Escribir logs en archivos
    new winston.transports.File({ 
      filename: path.join(logDir, 'error.log'), 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: path.join(logDir, 'combined.log') 
    }),
    // Escribir logs en consola
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        logFormat
      )
    })
  ],
});

module.exports = logger;`;
      
      // Escribir el archivo
      fs.writeFileSync(loggerPath, loggerContent);
      console.log('✅ Archivo logger.js creado correctamente');
    } else {
      console.log('✅ El archivo logger.js ya existe');
    }
  } catch (e) {
    console.error('⚠️ Error al configurar logger:', e.message);
  }

  // 3. Reiniciar la aplicación
  console.log('\n[PASO 3/3] Reiniciando la aplicación...');
  try {
    // Detener aplicación PM2 si existe
    try {
      execSync('pm2 stop websap', { stdio: 'ignore' });
      console.log('Aplicación detenida correctamente');
    } catch (e) {
      // Es normal que falle si la aplicación no está en ejecución
    }

    // Iniciar la aplicación con PM2
    console.log('Iniciando aplicación WebSAP con PM2...');
    process.env.NODE_ENV = 'production';
    execSync('pm2 start backend/server.js --name websap', {
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '..')
    });
    
    console.log('Verificando estado de PM2...');
    execSync('pm2 status', {
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '..')
    });
  } catch (e) {
    console.error('⚠️ Error al reiniciar aplicación:', e.message);
  }

  console.log('\n===== PROCESO COMPLETO =====');
  console.log('La aplicación WebSAP debería estar funcionando ahora.');
  console.log('Puedes acceder a ella en: http://93.127.129.46');
  console.log('\nSi sigues teniendo problemas, verifica:');
  console.log('1. El servicio de MySQL está ejecutándose');
  console.log('2. La configuración de base de datos en .env es correcta');
  console.log('3. Los logs de la aplicación: pm2 logs websap');

} catch (error) {
  console.error('Error en el proceso de reparación:', error);
}