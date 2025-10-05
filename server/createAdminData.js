require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const GlucometryRecord = require('./models/GlucometryRecord');
const MedicalExam = require('./models/MedicalExam');
const Recipe = require('./models/Recipe');

const createAdminData = async () => {
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

        // 1. CREAR REGISTROS DE GLUCOMETRÍA PARA EL ADMIN (últimos 20 días)
        console.log('\n📊 Creando registros de glucometría para el administrador...');

        const glucoseRecords = [];
        const today = new Date();

        for (let i = 1; i <= 20; i++) {
            const baseDate = new Date(today);
            baseDate.setDate(today.getDate() - i);

            // Registro matutino (ayunas) - valores normales para admin
            const morningDate = new Date(baseDate);
            morningDate.setHours(7, 0, 0, 0);
            glucoseRecords.push({
                userId: adminUser._id,
                date: morningDate,
                reading: Math.floor(Math.random() * 25) + 85, // 85-110 mg/dL (normal)
                mealTime: 'Ayunas',
                notes: i % 4 === 0 ? 'Control rutinario como administrador' : ''
            });

            // Registro post-almuerzo
            const afternoonDate = new Date(baseDate);
            afternoonDate.setHours(14, 30, 0, 0);
            glucoseRecords.push({
                userId: adminUser._id,
                date: afternoonDate,
                reading: Math.floor(Math.random() * 40) + 110, // 110-150 mg/dL
                mealTime: 'Después del almuerzo',
                notes: i % 5 === 0 ? 'Almuerzo de trabajo' : ''
            });

            // Registro nocturno (algunos días)
            if (i % 3 === 0) {
                const nightDate = new Date(baseDate);
                nightDate.setHours(21, 0, 0, 0);
                glucoseRecords.push({
                    userId: adminUser._id,
                    date: nightDate,
                    reading: Math.floor(Math.random() * 30) + 95, // 95-125 mg/dL
                    mealTime: 'Antes de dormir',
                    notes: 'Control nocturno'
                });
            }
        }

        await GlucometryRecord.insertMany(glucoseRecords);
        console.log(`✅ ${glucoseRecords.length} registros de glucometría creados para el administrador`);

        // 2. CREAR EXÁMENES MÉDICOS PARA EL ADMIN
        console.log('\n🏥 Creando exámenes médicos para el administrador...');

        const medicalExams = [];

        // Hemoglobina Glicosilada
        medicalExams.push({
            userId: adminUser._id,
            title: 'Hemoglobina Glicosilada - Control Trimestral',
            fileUrl: 'https://example.com/exams/admin-hba1c-2025.pdf',
            originalName: 'HbA1c_Admin_Oct2025.pdf',
            fileSize: 245760, // 240 KB
            mimeType: 'application/pdf',
            examDate: new Date(today.getTime() - (15 * 24 * 60 * 60 * 1000)), // Hace 15 días
            examType: 'Hemoglobina Glicosilada'
        });

        // Perfil Lipídico
        medicalExams.push({
            userId: adminUser._id,
            title: 'Perfil Lipídico Completo',
            fileUrl: 'https://example.com/exams/admin-lipids-2025.pdf',
            originalName: 'Perfil_Lipidico_Admin_Sep2025.pdf',
            fileSize: 189440, // 185 KB
            mimeType: 'application/pdf',
            examDate: new Date(today.getTime() - (45 * 24 * 60 * 60 * 1000)), // Hace 45 días
            examType: 'Perfil Lipídico'
        });

        // Fondo de Ojo
        medicalExams.push({
            userId: adminUser._id,
            title: 'Examen de Fondo de Ojo - Prevención Retinopatía',
            fileUrl: 'https://example.com/exams/admin-retina-2025.pdf',
            originalName: 'Fondo_Ojo_Admin_Ago2025.pdf',
            fileSize: 156672, // 153 KB
            mimeType: 'application/pdf',
            examDate: new Date(today.getTime() - (60 * 24 * 60 * 60 * 1000)), // Hace 60 días
            examType: 'Fondo de Ojo'
        });

        // Función Renal
        medicalExams.push({
            userId: adminUser._id,
            title: 'Pruebas de Función Renal',
            fileUrl: 'https://example.com/exams/admin-kidney-2025.pdf',
            originalName: 'Funcion_Renal_Admin_Jul2025.pdf',
            fileSize: 178176, // 174 KB
            mimeType: 'application/pdf',
            examDate: new Date(today.getTime() - (90 * 24 * 60 * 60 * 1000)), // Hace 90 días
            examType: 'Función Renal'
        });

        // Microalbúmina
        medicalExams.push({
            userId: adminUser._id,
            title: 'Microalbúmina en Orina - Control Anual',
            fileUrl: 'https://example.com/exams/admin-microalb-2025.pdf',
            originalName: 'Microalbumina_Admin_Jun2025.pdf',
            fileSize: 134144, // 131 KB
            mimeType: 'application/pdf',
            examDate: new Date(today.getTime() - (120 * 24 * 60 * 60 * 1000)), // Hace 120 días
            examType: 'Microalbúmina'
        });

        await MedicalExam.insertMany(medicalExams);
        console.log(`✅ ${medicalExams.length} exámenes médicos creados para el administrador`);

        // 3. CREAR RECETAS PERSONALIZADAS PARA EL ADMIN
        console.log('\n🍽️ Creando recetas personalizadas para el administrador...');

        const adminRecipes = [
            {
                editorId: adminUser._id,
                title: 'Desayuno Ejecutivo Saludable',
                description: 'Desayuno nutritivo y rápido perfecto para administradores ocupados. Alto en proteínas y bajo en carbohidratos simples.',
                imageUrl: 'https://via.placeholder.com/400x300/FF6B35/white?text=Desayuno+Ejecutivo',
                ingredients: [
                    '2 huevos orgánicos',
                    '1 rebanada de pan integral',
                    '1/2 aguacate mediano',
                    '1 taza de espinacas frescas',
                    '1 cucharada de aceite de oliva',
                    '1 tomate cherry',
                    'Sal y pimienta al gusto',
                    '1 taza de café americano sin azúcar'
                ],
                instructions: '1. Calentar aceite de oliva en sartén antiadherente. 2. Saltear las espinacas hasta que se marchiten. 3. Agregar los huevos y revolver suavemente. 4. Tostar el pan integral. 4. Servir los huevos sobre el pan, agregar aguacate en rebanadas y tomate cherry. 5. Acompañar con café americano.',
                prepTime: 12,
                servings: 1,
                tags: ['ejecutivo', 'desayuno', 'rápido', 'proteína', 'bajo-carbohidratos'],
                nutritionInfo: {
                    calories: 385,
                    carbohydrates: 22,
                    proteins: 18,
                    fats: 28,
                    fiber: 12
                },
                difficulty: 'Fácil'
            },
            {
                editorId: adminUser._id,
                title: 'Ensalada de Poder Administrativo',
                description: 'Ensalada completa y energizante diseñada para mantener la concentración durante largas jornadas de trabajo.',
                imageUrl: 'https://via.placeholder.com/400x300/28A745/white?text=Ensalada+Power',
                ingredients: [
                    '150g de pechuga de pollo a la plancha',
                    '2 tazas de rúcula fresca',
                    '1 taza de quinoa cocida',
                    '1/2 taza de arándanos secos',
                    '50g de queso feta',
                    '1/4 taza de nueces',
                    '2 cucharadas de aceite de oliva extra virgen',
                    '1 cucharada de vinagre balsámico',
                    '1 cucharadita de mostaza Dijon'
                ],
                instructions: '1. Cocinar la quinoa según instrucciones del paquete y dejar enfriar. 2. Preparar vinagreta mezclando aceite, vinagre y mostaza. 3. En un bowl grande, combinar rúcula, quinoa y arándanos. 4. Agregar pollo cortado en tiras. 5. Espolvorear queso feta y nueces. 6. Aliñar con vinagreta antes de servir.',
                prepTime: 25,
                servings: 2,
                tags: ['almuerzo', 'ejecutivo', 'proteína', 'energía', 'concentración'],
                nutritionInfo: {
                    calories: 485,
                    carbohydrates: 35,
                    proteins: 32,
                    fats: 25,
                    fiber: 8
                },
                difficulty: 'Intermedio'
            },
            {
                editorId: adminUser._id,
                title: 'Smoothie Verde del CEO',
                description: 'Batido energético perfecto para reuniones matutinas. Repleto de antioxidantes y energía sostenida.',
                imageUrl: 'https://via.placeholder.com/400x300/20C997/white?text=CEO+Smoothie',
                ingredients: [
                    '1 taza de espinacas baby',
                    '1/2 plátano maduro',
                    '1/2 manzana verde',
                    '1 cucharada de mantequilla de almendras',
                    '1 cucharadita de semillas de chía',
                    '1 taza de leche de almendras sin azúcar',
                    '1 cucharadita de miel orgánica',
                    'Hielo al gusto'
                ],
                instructions: '1. Lavar bien las espinacas. 2. Cortar el plátano y la manzana en trozos. 3. Agregar todos los ingredientes a la licuadora. 4. Licuar por 60 segundos hasta obtener textura cremosa. 5. Servir inmediatamente en vaso alto. 6. Opcional: decorar con semillas de chía adicionales.',
                prepTime: 5,
                servings: 1,
                tags: ['smoothie', 'energía', 'antioxidantes', 'rápido', 'oficina'],
                nutritionInfo: {
                    calories: 285,
                    carbohydrates: 38,
                    proteins: 8,
                    fats: 12,
                    fiber: 10
                },
                difficulty: 'Fácil'
            },
            {
                editorId: adminUser._id,
                title: 'Cena Ligera de Administrador',
                description: 'Cena perfecta después de un día intenso de trabajo. Ligera pero nutritiva, ideal para una buena digestión nocturna.',
                imageUrl: 'https://via.placeholder.com/400x300/6F42C1/white?text=Cena+Admin',
                ingredients: [
                    '150g de salmón fresco',
                    '200g de brócoli',
                    '1 calabacín mediano',
                    '1 cucharada de aceite de coco',
                    '1 limón',
                    '2 dientes de ajo',
                    'Sal marina y pimienta',
                    'Hierbas frescas (tomillo, romero)'
                ],
                instructions: '1. Precalentar horno a 180°C. 2. Cortar vegetables en trozos uniformes. 3. Marinar salmón con limón, ajo y hierbas por 10 minutos. 4. Colocar vegetables en bandeja con aceite de coco. 5. Hornear vegetables 15 minutos, agregar salmón y cocinar 12 minutos más. 6. Servir caliente con un toque de limón fresco.',
                prepTime: 35,
                servings: 1,
                tags: ['cena', 'ligero', 'omega-3', 'saludable', 'ejecutivo'],
                nutritionInfo: {
                    calories: 420,
                    carbohydrates: 15,
                    proteins: 35,
                    fats: 25,
                    fiber: 8
                },
                difficulty: 'Intermedio'
            }
        ];

        await Recipe.insertMany(adminRecipes);
        console.log(`✅ ${adminRecipes.length} recetas personalizadas creadas para el administrador`);

        // RESUMEN FINAL
        console.log('\n🎉 ¡DATOS DEL ADMINISTRADOR CREADOS EXITOSAMENTE!');
        console.log('═══════════════════════════════════════════════════');
        console.log(`👑 Usuario: ${adminUser.name}`);
        console.log(`📧 Email: ${adminUser.email}`);
        console.log(`🆔 ID: ${adminUser._id}`);
        console.log('───────────────────────────────────────────────────');
        console.log(`📊 Registros de Glucometría: ${glucoseRecords.length}`);
        console.log(`🏥 Exámenes Médicos: ${medicalExams.length}`);
        console.log(`🍽️ Recetas Personalizadas: ${adminRecipes.length}`);
        console.log('═══════════════════════════════════════════════════');
        console.log('✨ El administrador ahora tiene datos completos para demostración');

        mongoose.disconnect();

    } catch (error) {
        console.error('❌ Error creando datos del administrador:', error);
    }
};

createAdminData();