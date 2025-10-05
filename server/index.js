require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');

const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Start server
const server = app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
    console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 API disponible en: http://localhost:${PORT}/api`);
    console.log(`� Documentación Swagger: http://localhost:${PORT}/api/docs`);
    console.log(`�💾 MongoDB: ${process.env.MONGODB_URI || 'mongodb://localhost:27017/appcontrol'}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log('❌ Error: Unhandled Promise Rejection');
    console.log(err);
    server.close(() => {
        process.exit(1);
    });
});

// Handle SIGTERM
process.on('SIGTERM', () => {
    console.log('👋 SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('💤 Process terminated');
    });
});