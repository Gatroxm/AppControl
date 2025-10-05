require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const GlucometryRecord = require('./models/GlucometryRecord');

const createAdmin20Records = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/appcontrol';
        await mongoose.connect(mongoUri);

        console.log('🔍 Buscando usuario administrador...');

        // Encontrar el usuario administrador
        const adminUser = await User.findOne({
            email: 'admin@appcontrol.com',
            role: 'admin'
        });

        if (!adminUser) {
            console.log('❌ No se encontró el usuario administrador');
            return;
        }

        console.log(`✅ Usuario administrador encontrado: ${adminUser.name} (ID: ${adminUser._id})`);

        // Eliminar todos los registros existentes del admin
        console.log('\n🧹 Eliminando registros existentes del administrador...');
        const deleteResult = await GlucometryRecord.deleteMany({ userId: adminUser._id });
        console.log(`✅ ${deleteResult.deletedCount} registros eliminados`);

        // Crear exactamente 20 nuevos registros de glucometría para el admin
        console.log('\n📊 Creando exactamente 20 registros de glucometría para el administrador...');

        const glucoseRecords = [];
        const today = new Date();

        for (let i = 0; i < 20; i++) {
            const baseDate = new Date(today);
            baseDate.setDate(today.getDate() - i - 1); // Empezar desde ayer

            // Registro matutino (ayunas) - valores normales para admin
            const recordDate = new Date(baseDate);
            recordDate.setHours(7, Math.floor(Math.random() * 60), 0, 0); // Entre 7:00 y 7:59

            const mealTimes = ['Ayunas', 'Después del desayuno', 'Antes del almuerzo', 'Después del almuerzo', 'Antes de la cena', 'Después de la cena'];
            const randomMealTime = mealTimes[Math.floor(Math.random() * mealTimes.length)];

            // Generar lecturas realistas basadas en el momento de comida
            let reading;
            switch (randomMealTime) {
                case 'Ayunas':
                    reading = Math.floor(Math.random() * 25) + 80; // 80-105 mg/dL
                    break;
                case 'Después del desayuno':
                case 'Después del almuerzo':
                case 'Después de la cena':
                    reading = Math.floor(Math.random() * 40) + 120; // 120-160 mg/dL
                    break;
                default:
                    reading = Math.floor(Math.random() * 30) + 90; // 90-120 mg/dL
            }

            const notes = [
                'Control rutinario como administrador',
                'Reunión de trabajo - estrés leve',
                'Ejercicio matutino realizado',
                'Alimentación controlada',
                'Día normal de oficina',
                'Control post-entrenamiento',
                'Seguimiento médico',
                ''
            ];

            glucoseRecords.push({
                userId: adminUser._id,
                date: recordDate,
                reading: reading,
                mealTime: randomMealTime,
                notes: notes[Math.floor(Math.random() * notes.length)]
            });
        }

        await GlucometryRecord.insertMany(glucoseRecords);
        console.log(`✅ ${glucoseRecords.length} registros de glucometría creados para el administrador`);

        // Verificar el conteo final
        const finalCount = await GlucometryRecord.countDocuments({ userId: adminUser._id });

        console.log('\n🎉 ¡REGISTROS DEL ADMINISTRADOR CREADOS EXITOSAMENTE!');
        console.log('═══════════════════════════════════════════════════');
        console.log(`👑 Usuario: ${adminUser.name}`);
        console.log(`📧 Email: ${adminUser.email}`);
        console.log(`🆔 ID: ${adminUser._id}`);
        console.log('───────────────────────────────────────────────────');
        console.log(`📊 Total de Registros de Glucometría: ${finalCount}`);
        console.log('═══════════════════════════════════════════════════');
        console.log('✨ El administrador ahora tiene exactamente 20 registros de glucometría');

        mongoose.disconnect();

    } catch (error) {
        console.error('❌ Error creando registros del administrador:', error);
    }
};

createAdmin20Records();