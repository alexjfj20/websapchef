#!/bin/bash

# Script para subir el proyecto WebSAP a GitHub
echo "Iniciando preparación para subir a GitHub..."

# Verificar si Git está inicializado
if [ ! -d .git ]; then
  echo "Inicializando repositorio Git..."
  git init
fi

# Crear archivo .gitignore
echo "Creando archivo .gitignore..."
cat > .gitignore << EOF
# Dependencias
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
EOF

# Añadir archivos al repositorio
echo "Añadiendo archivos al repositorio..."
git add .

# Realizar el primer commit
echo "Realizando commit inicial..."
git commit -m "Commit inicial del proyecto WebSAP"

# Configurar el repositorio remoto
echo "Configurando repositorio remoto..."
git remote add origin https://github.com/alexjfj20/websapchef.git

# Subir al repositorio
echo "Subiendo archivos a GitHub..."
git push -u origin master || git push -u origin main

echo "¡Proceso completado! El proyecto ha sido subido a https://github.com/alexjfj20/websapchef.git"
echo "Si es la primera vez que usas Git desde este equipo, es posible que te solicite credenciales de GitHub."