require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const checkUsers = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/appcontrol';
        await mongoose.connect(mongoUri);

        const users = await User.find().select('name email role isActive');
        console.log('Usuarios en la base de datos:');
        console.log(users);

        if (users.length === 0) {
            console.log('No hay usuarios. Ejecuta el seeder primero.');
        }

        mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
};

checkUsers();