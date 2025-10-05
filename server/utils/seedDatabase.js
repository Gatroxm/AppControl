require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const GlucometryRecord = require('../models/GlucometryRecord');
const MedicalExam = require('../models/MedicalExam');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Conectado: ${conn.connection.host}`);
    } catch (error) {
        console.error('Error conectando a MongoDB:', error.message);
        process.exit(1);
    }
};

const seedDatabase = async () => {
    try {
        console.log('🌱 Iniciando seedeo de la base de datos...');

        // ========= USUARIOS =========
        // Admin user
        const existingAdmin = await User.findOne({ email: 'admin@appcontrol.com' });
        let adminUser;

        if (!existingAdmin) {
            adminUser = new User({
                name: 'Administrador AppControl',
                email: 'admin@appcontrol.com',
                password: 'Admin123!',
                role: 'admin',
                profile: {
                    age: 35,
                    height: 175,
                    weight: 70,
                    diabetesType: 'Tipo 1',
                    diagnosis_date: new Date('2020-01-15'),
                    currentMedication: 'Insulina Lantus, Metformina',
                    emergencyContact: 'María García',
                    emergencyPhone: '+34 600 123 456'
                }
            });
            await adminUser.save();
            console.log('✅ Usuario administrador creado');
        } else {
            adminUser = existingAdmin;
            console.log('ℹ️  Usuario administrador ya existe');
        }

        // Editor user
        const existingEditor = await User.findOne({ email: 'editor@appcontrol.com' });
        let editorUser;

        if (!existingEditor) {
            editorUser = new User({
                name: 'Editor de Recetas',
                email: 'editor@appcontrol.com',
                password: 'Editor123!',
                role: 'editor',
                profile: {
                    age: 28,
                    height: 165,
                    weight: 60,
                    diabetesType: 'Tipo 2',
                    diagnosis_date: new Date('2021-06-10'),
                    currentMedication: 'Metformina 850mg',
                    emergencyContact: 'Carlos López',
                    emergencyPhone: '+34 600 654 321'
                }
            });
            await editorUser.save();
            console.log('✅ Usuario editor creado');
        } else {
            editorUser = existingEditor;
            console.log('ℹ️  Usuario editor ya existe');
        }

        // Regular user
        const existingUser = await User.findOne({ email: 'usuario@appcontrol.com' });
        let regularUser;

        if (!existingUser) {
            regularUser = new User({
                name: 'Juan Pérez',
                email: 'usuario@appcontrol.com',
                password: 'User123!',
                role: 'user',
                profile: {
                    age: 45,
                    height: 180,
                    weight: 85,
                    diabetesType: 'Tipo 2',
                    diagnosis_date: new Date('2019-03-22'),
                    currentMedication: 'Insulina Humalog, Metformina',
                    emergencyContact: 'Ana Pérez',
                    emergencyPhone: '+34 600 987 654'
                }
            });
            await regularUser.save();
            console.log('✅ Usuario regular creado');
        } else {
            regularUser = existingUser;
            console.log('ℹ️  Usuario regular ya existe');
        }

        // Usuarios adicionales de muestra
        const sampleUsers = [
            {
                name: 'María González',
                email: 'maria.gonzalez@email.com',
                password: 'User123!',
                role: 'user',
                isActive: true,
                profile: {
                    age: 52,
                    height: 162,
                    weight: 68,
                    diabetesType: 'Tipo 2',
                    diagnosis_date: new Date('2018-11-05'),
                    currentMedication: 'Metformina, Glibenclamida',
                    emergencyContact: 'Pedro González',
                    emergencyPhone: '+34 600 111 222'
                }
            },
            {
                name: 'Carlos Rodríguez',
                email: 'carlos.rodriguez@email.com',
                password: 'User123!',
                role: 'user',
                isActive: true,
                profile: {
                    age: 38,
                    height: 178,
                    weight: 82,
                    diabetesType: 'Tipo 1',
                    diagnosis_date: new Date('2015-07-12'),
                    currentMedication: 'Insulina Novolog, Lantus',
                    emergencyContact: 'Laura Rodríguez',
                    emergencyPhone: '+34 600 333 444'
                }
            },
            {
                name: 'Ana Martínez',
                email: 'ana.martinez@email.com',
                password: 'User123!',
                role: 'user',
                isActive: false,
                profile: {
                    age: 29,
                    height: 170,
                    weight: 65,
                    diabetesType: 'Tipo 1',
                    diagnosis_date: new Date('2022-01-18'),
                    currentMedication: 'Insulina Fiasp',
                    emergencyContact: 'Miguel Martínez',
                    emergencyPhone: '+34 600 555 666'
                }
            },
            {
                name: 'Isabel Fernández',
                email: 'isabel.fernandez@email.com',
                password: 'User123!',
                role: 'user',
                isActive: true,
                profile: {
                    age: 41,
                    height: 158,
                    weight: 72,
                    diabetesType: 'Gestacional',
                    diagnosis_date: new Date('2023-02-14'),
                    currentMedication: 'Dieta controlada',
                    emergencyContact: 'Roberto Fernández',
                    emergencyPhone: '+34 600 777 888'
                }
            }
        ];

        for (const userData of sampleUsers) {
            const existingUser = await User.findOne({ email: userData.email });
            if (!existingUser) {
                const user = new User(userData);
                await user.save();
                console.log(`✅ Usuario ${userData.name} creado`);
            }
        }

        // ========= REGISTROS DE GLUCOMETRÍA =========
        const existingGlucoseRecords = await GlucometryRecord.find({ user: regularUser._id });

        if (existingGlucoseRecords.length === 0) {
            const glucoseData = [];
            const today = new Date();

            // Generar 15 registros de los últimos 15 días
            for (let i = 1; i <= 15; i++) {
                const baseDate = new Date(today);
                baseDate.setDate(today.getDate() - i);

                // Registros matutinos (ayunas)
                const morningDate = new Date(baseDate);
                morningDate.setHours(7, 30, 0, 0);
                glucoseData.push({
                    userId: regularUser._id,
                    date: morningDate,
                    reading: Math.floor(Math.random() * 40) + 80, // 80-120
                    mealTime: 'Ayunas',
                    notes: i % 3 === 0 ? 'Me siento bien hoy' : ''
                });

                // Registros después del almuerzo
                const afternoonDate = new Date(baseDate);
                afternoonDate.setHours(14, 0, 0, 0);
                glucoseData.push({
                    userId: regularUser._id,
                    date: afternoonDate,
                    reading: Math.floor(Math.random() * 60) + 120, // 120-180
                    mealTime: 'Después del almuerzo',
                    notes: i % 4 === 0 ? 'Comí pasta integral' : ''
                });

                // Registros nocturnos (solo algunos días)
                if (i % 2 === 0) {
                    const nightDate = new Date(baseDate);
                    nightDate.setHours(22, 0, 0, 0);
                    glucoseData.push({
                        userId: regularUser._id,
                        date: nightDate,
                        reading: Math.floor(Math.random() * 30) + 90, // 90-120
                        mealTime: 'Antes de dormir',
                        notes: i % 6 === 0 ? 'Cena ligera' : ''
                    });
                }
            }

            await GlucometryRecord.insertMany(glucoseData);
            console.log(`✅ ${glucoseData.length} registros de glucometría creados`);
        } else {
            console.log('ℹ️  Los registros de glucometría ya existen');
        }

        // ========= RECETAS =========
        const existingRecipes = await Recipe.find();

        if (existingRecipes.length < 10) {
            const recipes = [
                {
                    editorId: editorUser._id,
                    title: 'Ensalada Mediterranean Diabética',
                    description: 'Una deliciosa ensalada mediterránea baja en carbohidratos, perfecta para diabéticos. Rica en nutrientes y con un sabor fresco que te encantará.',
                    imageUrl: 'https://via.placeholder.com/400x300/4CAF50/white?text=Ensalada+Mediterranea',
                    ingredients: [
                        '2 tazas de espinacas frescas',
                        '1 tomate grande cortado en cubos',
                        '1/2 pepino en rodajas',
                        '50g de queso feta bajo en grasa',
                        '10 aceitunas kalamata',
                        '1 cucharada de aceite de oliva extra virgen',
                        '1 cucharada de vinagre balsámico',
                        'Orégano seco al gusto'
                    ],
                    instructions: '1. Lavar bien las espinacas y colocarlas en un bowl grande. 2. Agregar el tomate cortado y el pepino en rodajas. 3. Desmenuzar el queso feta sobre la ensalada. 4. Añadir las aceitunas. 5. En un recipiente pequeño, mezclar el aceite de oliva con el vinagre balsámico. 6. Aliñar la ensalada y espolvorear con orégano. 7. Servir inmediatamente.',
                    prepTime: 15,
                    servings: 2,
                    tags: ['bajo-carbohidratos', 'mediterráneo', 'vegetariano'],
                    nutritionInfo: {
                        calories: 180,
                        carbohydrates: 8,
                        proteins: 6,
                        fat: 14,
                        fiber: 4
                    }
                },
                {
                    editorId: editorUser._id,
                    title: 'Salmón al Horno con Vegetales',
                    description: 'Deliciosos filetes de salmón horneados con una mezcla colorida de vegetales frescos. Una opción saludable rica en omega-3 y perfecta para diabéticos.',
                    imageUrl: 'https://via.placeholder.com/400x300/FF9800/white?text=Salmon+al+Horno',
                    ingredients: [
                        '4 filetes de salmón (150g cada uno)',
                        '2 calabacines cortados en rodajas',
                        '1 pimiento rojo en tiras',
                        '1 pimiento amarillo en tiras',
                        '200g de brócoli en floretes',
                        '2 cucharadas de aceite de oliva',
                        '2 dientes de ajo picados',
                        'Sal y pimienta al gusto',
                        'Limón para servir'
                    ],
                    instructions: '1. Precalentar el horno a 200°C. 2. Colocar los vegetales en una bandeja para horno. 3. Rociar con aceite de oliva y ajo, sazonar con sal y pimienta. 4. Hornear los vegetales durante 15 minutos. 5. Añadir los filetes de salmón a la bandeja. 6. Continuar horneando por 12-15 minutos más. 7. Servir con rodajas de limón.',
                    prepTime: 30,
                    servings: 4,
                    tags: ['rico-proteína', 'omega-3', 'bajo-carbohidratos'],
                    nutritionInfo: {
                        calories: 320,
                        carbohydrates: 12,
                        proteins: 35,
                        fats: 18,
                        fiber: 5
                    }
                },
                {
                    editorId: editorUser._id,
                    title: 'Smoothie Verde Antioxidante',
                    description: 'Batido verde lleno de antioxidantes y bajo en azúcar. Perfecto para empezar el día con energía y nutrientes esenciales.',
                    imageUrl: 'https://via.placeholder.com/400x300/4CAF50/white?text=Smoothie+Verde',
                    ingredients: [
                        '1 taza de espinacas frescas',
                        '1/2 aguacate maduro',
                        '1 pepino pequeño',
                        '1 manzana verde sin semillas',
                        '1 cucharada de semillas de chía',
                        '1 taza de agua de coco sin azúcar',
                        'Jugo de 1/2 limón',
                        'Stevia al gusto'
                    ],
                    instructions: '1. Lavar todos los ingredientes frescos. 2. Cortar la manzana y el pepino en trozos. 3. Colocar todos los ingredientes en la licuadora. 4. Licuar hasta obtener una consistencia suave. 5. Ajustar el dulzor con stevia si es necesario. 6. Servir inmediatamente con hielo.',
                    prepTime: 10,
                    servings: 2,
                    tags: ['antioxidante', 'verde', 'bajo-azúcar', 'detox'],
                    nutritionInfo: {
                        calories: 145,
                        carbohydrates: 15,
                        proteins: 4,
                        fats: 8,
                        fiber: 8
                    }
                },
                {
                    editorId: editorUser._id,
                    title: 'Pollo a la Plancha con Quinoa',
                    description: 'Pechuga de pollo jugosa acompañada de quinoa nutritiva. Una combinación perfecta de proteínas de alta calidad y carbohidratos complejos.',
                    imageUrl: 'https://via.placeholder.com/400x300/795548/white?text=Pollo+Quinoa',
                    ingredients: [
                        '4 pechugas de pollo deshuesadas',
                        '1 taza de quinoa',
                        '2 tazas de caldo de pollo bajo en sodio',
                        '1 cucharada de aceite de oliva',
                        '1 cucharadita de paprika',
                        '1 cucharadita de orégano',
                        'Sal y pimienta al gusto',
                        'Perejil fresco para decorar'
                    ],
                    instructions: '1. Enjuagar la quinoa hasta que el agua salga clara. 2. Cocinar la quinoa en caldo de pollo durante 15 minutos. 3. Sazonar las pechugas con paprika, orégano, sal y pimienta. 4. Calentar aceite en una sartén a fuego medio-alto. 5. Cocinar el pollo 6-7 minutos por cada lado. 6. Dejar reposar el pollo 5 minutos antes de cortar. 7. Servir sobre la quinoa y decorar con perejil.',
                    prepTime: 25,
                    servings: 4,
                    tags: ['alto-proteína', 'quinoa', 'sin-gluten'],
                    nutritionInfo: {
                        calories: 280,
                        carbohydrates: 20,
                        proteins: 32,
                        fats: 8,
                        fiber: 3
                    }
                },
                {
                    editorId: editorUser._id,
                    title: 'Ensalada de Lentejas Mediterránea',
                    description: 'Ensalada nutritiva de lentejas con vegetales frescos del mediterráneo. Rica en proteínas vegetales y perfecta para una comida completa y saludable.',
                    imageUrl: 'https://via.placeholder.com/400x300/2196F3/white?text=Ensalada+Lentejas',
                    ingredients: [
                        '1 taza de lentejas cocidas',
                        '1 pepino cortado en cubos',
                        '2 tomates cherry cortados por la mitad',
                        '1/4 de cebolla roja finamente picada',
                        '50g de queso feta desmenuzado',
                        '2 cucharadas de aceite de oliva',
                        '1 cucharada de vinagre de vino tinto',
                        'Menta fresca picada',
                        'Sal y pimienta al gusto'
                    ],
                    instructions: '1. Si las lentejas están secas, cocinarlas hasta que estén tiernas. 2. Dejar enfriar las lentejas completamente. 3. Mezclar lentejas con pepino, tomates y cebolla. 4. Preparar vinagreta mezclando aceite, vinagre, sal y pimienta. 5. Aliñar la ensalada con la vinagreta. 6. Agregar el queso feta y la menta fresca. 7. Refrigerar 30 minutos antes de servir.',
                    prepTime: 20,
                    servings: 3,
                    tags: ['vegetariano', 'alto-fibra', 'mediterráneo', 'proteína-vegetal'],
                    nutritionInfo: {
                        calories: 220,
                        carbohydrates: 25,
                        proteins: 12,
                        fats: 8,
                        fiber: 10
                    }
                }
            ];

            await Recipe.insertMany(recipes);
            console.log(`✅ ${recipes.length} recetas creadas`);
        } else {
            console.log('ℹ️  Las recetas de ejemplo ya existen');
        }

        console.log('🎉 Seedeo completado exitosamente!');

        console.log('\n📊 Resumen de usuarios creados:');
        console.log('   👑 Admin: admin@appcontrol.com / Admin123!');
        console.log('   ✏️  Editor: editor@appcontrol.com / Editor123!');
        console.log('   👤 Usuario: usuario@appcontrol.com / User123!');
        console.log('\n🚨 IMPORTANTE: Cambia las contraseñas por defecto en producción!');

    } catch (error) {
        console.error('Error durante el seedeo:', error.message);
    }
};

const runSeed = async () => {
    await connectDB();
    await seedDatabase();
    mongoose.disconnect();
    console.log('🔌 Conexión a MongoDB cerrada');
};

if (require.main === module) {
    runSeed();
}

module.exports = { seedDatabase, connectDB };