# WebSAP

## Descripción
WebSAP es una aplicación web desarrollada con Vue.js en el frontend y Express.js en el backend. La aplicación proporciona una plataforma para gestionar recursos y procesos empresariales.

## Tecnologías
- **Frontend**: Vue.js 3, Chart.js, Vue Router
- **Backend**: Node.js, Express, Sequelize ORM
- **Base de datos**: MySQL
- **Autenticación**: JWT (JSON Web Tokens)

## Características
- Interfaz de usuario moderna y responsive
- Generación de reportes en PDF y Excel
- Gráficos y visualizaciones de datos
- API RESTful segura
- Autenticación y autorización de usuarios

## Instalación

### Requisitos previos
- Node.js (v14 o superior)
- MySQL
- npm o yarn

### Pasos de instalación
1. Clonar el repositorio:
   ```
   git clone https://github.com/alexjfj20/websapchef.git
   cd websapchef
   ```

2. Instalar dependencias:
   ```
   npm install
   ```

3. Configurar variables de entorno:
   - Crear un archivo `.env` en la raíz del proyecto
   - Definir las variables necesarias (ver `.env.example`)

4. Inicializar la base de datos:
   ```
   npm run seed
   ```

5. Iniciar el servidor de desarrollo:
   ```
   npm run dev
   ```

## Despliegue en producción
Para desplegar en producción, sigue los siguientes pasos:

1. Compilar la aplicación frontend:
   ```
   npm run build
   ```

2. Iniciar el servidor en modo producción:
   ```
   npm run prod
   ```

Consulta el archivo `INSTRUCCIONES_DESPLIEGUE.md` para obtener información detallada sobre el despliegue con Caddy en un VPS.

## Estructura del proyecto
```
websap/
├── backend/           # Código del servidor Express
├── public/            # Archivos estáticos
├── src/               # Código fuente del frontend Vue
├── dist/              # Compilación de producción (generado)
├── scripts/           # Scripts de utilidad
└── ...
```

## Licencia
[MIT](LICENSE)