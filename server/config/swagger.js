const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Configuración de Swagger
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'AppControl API',
            version: '1.0.0',
            description: 'API para la aplicación de control de diabetes AppControl',
            contact: {
                name: 'AppControl Team',
                email: 'support@appcontrol.com'
            }
        },
        servers: [
            {
                url: process.env.NODE_ENV === 'production'
                    ? 'https://api.appcontrol.com'
                    : 'http://localhost:5000',
                description: process.env.NODE_ENV === 'production'
                    ? 'Servidor de Producción'
                    : 'Servidor de Desarrollo'
            }
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Token JWT para autenticación'
                }
            },
            schemas: {
                User: {
                    type: 'object',
                    required: ['name', 'email', 'password'],
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'ID único del usuario'
                        },
                        name: {
                            type: 'string',
                            description: 'Nombre completo del usuario',
                            example: 'Juan Pérez'
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'Correo electrónico del usuario',
                            example: 'juan@example.com'
                        },
                        role: {
                            type: 'string',
                            enum: ['user', 'editor', 'admin'],
                            description: 'Rol del usuario en el sistema',
                            example: 'user'
                        },
                        isActive: {
                            type: 'boolean',
                            description: 'Estado de activación del usuario',
                            example: true
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Fecha de creación del usuario'
                        }
                    }
                },
                GlucometryRecord: {
                    type: 'object',
                    required: ['reading', 'mealTime'],
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'ID único del registro'
                        },
                        userId: {
                            type: 'string',
                            description: 'ID del usuario propietario del registro'
                        },
                        reading: {
                            type: 'number',
                            minimum: 20,
                            maximum: 600,
                            description: 'Lectura de glucosa en mg/dL',
                            example: 120
                        },
                        mealTime: {
                            type: 'string',
                            enum: ['fasting', 'breakfast', 'lunch', 'dinner', 'bedtime'],
                            description: 'Momento del día de la medición',
                            example: 'fasting'
                        },
                        notes: {
                            type: 'string',
                            maxLength: 500,
                            description: 'Notas adicionales sobre la medición',
                            example: 'Me sentía un poco cansado'
                        },
                        date: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Fecha y hora de la medición'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Fecha de creación del registro'
                        }
                    }
                },
                Recipe: {
                    type: 'object',
                    required: ['title', 'description', 'ingredients', 'instructions', 'prepTime', 'servings'],
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'ID único de la receta'
                        },
                        editorId: {
                            type: 'string',
                            description: 'ID del editor que creó la receta'
                        },
                        title: {
                            type: 'string',
                            maxLength: 200,
                            description: 'Título de la receta',
                            example: 'Ensalada de quinoa con vegetales'
                        },
                        description: {
                            type: 'string',
                            minLength: 50,
                            description: 'Descripción detallada de la receta',
                            example: 'Una deliciosa ensalada rica en proteínas y fibra, perfecta para diabéticos'
                        },
                        imageUrl: {
                            type: 'string',
                            description: 'URL de la imagen de la receta'
                        },
                        ingredients: {
                            type: 'array',
                            items: {
                                type: 'string'
                            },
                            description: 'Lista de ingredientes necesarios',
                            example: ['1 taza de quinoa', '2 tomates medianos', '1 pepino']
                        },
                        instructions: {
                            type: 'string',
                            minLength: 50,
                            description: 'Instrucciones paso a paso para preparar la receta'
                        },
                        prepTime: {
                            type: 'number',
                            minimum: 1,
                            maximum: 600,
                            description: 'Tiempo de preparación en minutos',
                            example: 30
                        },
                        servings: {
                            type: 'number',
                            minimum: 1,
                            maximum: 50,
                            description: 'Número de porciones',
                            example: 4
                        },
                        difficulty: {
                            type: 'string',
                            enum: ['Fácil', 'Intermedio', 'Difícil'],
                            description: 'Nivel de dificultad de la receta',
                            example: 'Fácil'
                        },
                        tags: {
                            type: 'array',
                            items: {
                                type: 'string'
                            },
                            description: 'Etiquetas asociadas a la receta',
                            example: ['vegetariano', 'sin gluten', 'bajo-sodio']
                        },
                        isPublished: {
                            type: 'boolean',
                            description: 'Estado de publicación de la receta',
                            example: true
                        }
                    }
                },
                MedicalExam: {
                    type: 'object',
                    required: ['title', 'examType', 'examDate'],
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'ID único del examen'
                        },
                        userId: {
                            type: 'string',
                            description: 'ID del usuario propietario del examen'
                        },
                        title: {
                            type: 'string',
                            maxLength: 200,
                            description: 'Título del examen médico',
                            example: 'Hemoglobina Glucosilada'
                        },
                        examType: {
                            type: 'string',
                            enum: ['blood', 'urine', 'imaging', 'other'],
                            description: 'Tipo de examen médico',
                            example: 'blood'
                        },
                        examDate: {
                            type: 'string',
                            format: 'date',
                            description: 'Fecha del examen',
                            example: '2024-01-15'
                        },
                        doctor: {
                            type: 'string',
                            maxLength: 200,
                            description: 'Nombre del médico que realizó el examen',
                            example: 'Dr. García'
                        },
                        notes: {
                            type: 'string',
                            maxLength: 1000,
                            description: 'Notas adicionales sobre el examen'
                        },
                        fileUrl: {
                            type: 'string',
                            description: 'URL del archivo del examen'
                        },
                        fileName: {
                            type: 'string',
                            description: 'Nombre original del archivo'
                        }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false
                        },
                        message: {
                            type: 'string',
                            example: 'Error en la operación'
                        },
                        errors: {
                            type: 'array',
                            items: {
                                type: 'string'
                            }
                        }
                    }
                },
                Success: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: true
                        },
                        message: {
                            type: 'string',
                            example: 'Operación exitosa'
                        },
                        data: {
                            type: 'object',
                            description: 'Datos de la respuesta'
                        }
                    }
                }
            }
        },
        security: [
            {
                BearerAuth: []
            }
        ]
    },
    apis: [
        './routes/*.js',
        './controllers/*.js'
    ]
};

const specs = swaggerJsdoc(options);

module.exports = {
    swaggerUi,
    specs
};