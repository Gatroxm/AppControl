require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const GlucometryRecord = require('./models/GlucometryRecord');
const MedicalExam = require('./models/MedicalExam');
const Recipe = require('./models/Recipe');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    try {
        const admin = await User.findOne({ email: 'admin@appcontrol.com' });

        const glucoseCount = await GlucometryRecord.countDocuments({ userId: admin._id });
        const examCount = await MedicalExam.countDocuments({ userId: admin._id });
        const recipeCount = await Recipe.countDocuments({ editorId: admin._id });

        const avgGlucoseResult = await GlucometryRecord.aggregate([
            { $match: { userId: admin._id } },
            { $group: { _id: null, avg: { $avg: '$reading' } } }
        ]);

        console.log('=== DATOS DEL ADMINISTRADOR ===');
        console.log('📊 Registros de glucosa:', glucoseCount);
        console.log('🏥 Exámenes médicos:', examCount);
        console.log('🍽️ Recetas creadas:', recipeCount);
        console.log('📈 Promedio glucosa:', avgGlucoseResult[0]?.avg?.toFixed(1) || '0', 'mg/dL');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        mongoose.disconnect();
    }
});