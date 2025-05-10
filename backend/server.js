const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Import your routes
const app = express();
const PORT = process.env.PORT || 3000;

// Security and logging middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      imgSrc: ["'self'", 'data:', 'blob:'],
      connectSrc: ["'self'", `http://93.127.129.46:${PORT}`],
    },
  }
}));
app.use(morgan('combined'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes - add your route imports and configurations here
const syncRoutes = require('./routes/syncRoutes');
const authRoutes = require('./routes/authRoutes');
const directDeleteRoutes = require('./routes/directDeleteRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes'); // Rutas de administración
const platosRoutes = require('./routes/platosRoutes'); // Rutas de platos
const platoRoutes = require('./routes/platoRoutes'); // Rutas de plato individual
const indexedDBRoutes = require('./routes/indexedDBRoutes'); // Rutas para IndexedDB
const whatsappRoutes = require('./routes/whatsappRoutes'); // Rutas para WhatsApp
const restauranteRoutes = require('./routes/restauranteRoutes'); // Rutas para restaurantes

// Registrar las rutas
app.use('/api/sync', syncRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes); // Rutas de administración
app.use('/api/platos', platosRoutes); // Rutas de platos
app.use('/api/plato', platoRoutes); // Rutas de plato individual
app.use('/api/indexeddb', indexedDBRoutes); // Rutas para IndexedDB
app.use('/api/whatsapp', whatsappRoutes); // Rutas para WhatsApp
app.use('/api/restaurantes', restauranteRoutes); // Rutas para restaurantes
app.use('/', directDeleteRoutes);

// Serve static files from the Vue app build directory in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  // Handle SPA routing - send all non-API requests to index.html
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, '../dist/index.html'));
    }
  });
}

// Error handling
app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`Server address: http://93.127.129.46:${PORT}`);
});
