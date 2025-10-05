require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Start server
const server = app.listen(PORT, () => {
    console.log(`
🚀 AppControl Server iniciado correctamente!

📋 Información del servidor:
   • Puerto: ${PORT}
   • Entorno: ${process.env.NODE_ENV || 'development'}
   • Base de datos: ${process.env.MONGODB_URI || 'mongodb://localhost:27017/appcontrol'}

🌐 Endpoints disponibles:
   • API Info: http://localhost:${PORT}/api
   • Health Check: http://localhost:${PORT}/api/health
   • Autenticación: http://localhost:${PORT}/api/auth
   • Usuarios: http://localhost:${PORT}/api/users
   • Glucometría: http://localhost:${PORT}/api/records/glucometry
   • Exámenes: http://localhost:${PORT}/api/records/exams
   • Recetas: http://localhost:${PORT}/api/recipes

📁 Archivos estáticos:
   • Uploads: http://localhost:${PORT}/uploads

💡 Para desarrollo:
   • Instala las dependencias del cliente: cd ../client && npm install
   • Ejecuta el frontend: npm start (desde la carpeta client)
   • Ejecuta ambos (desde raíz): npm run dev
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.error('Unhandled Promise Rejection:', err.message);
    server.close(() => {
        process.exit(1);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err.message);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('Process terminated');
    });
});