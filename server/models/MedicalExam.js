const mongoose = require('mongoose');

const medicalExamSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El ID del usuario es requerido'],
    },
    title: {
        type: String,
        required: [true, 'El título del examen es requerido'],
        trim: true,
        maxlength: [200, 'El título no puede exceder 200 caracteres'],
    },
    fileUrl: {
        type: String,
        required: [true, 'La URL del archivo es requerida'],
    },
    originalName: {
        type: String,
        required: true,
    },
    fileSize: {
        type: Number,
        required: true,
    },
    mimeType: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                const allowedTypes = [
                    'application/pdf',
                    'image/jpeg',
                    'image/png',
                    'image/gif',
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                ];
                return allowedTypes.includes(value);
            },
            message: 'Tipo de archivo no permitido',
        },
    },
    uploadDate: {
        type: Date,
        required: [true, 'La fecha de subida es requerida'],
        default: Date.now,
    },
    examDate: {
        type: Date,
        validate: {
            validator: function (value) {
                return !value || value <= new Date();
            },
            message: 'La fecha del examen no puede ser futura',
        },
    },
    examType: {
        type: String,
        enum: ['Hemoglobina Glicosilada', 'Glucosa en Ayunas', 'Curva de Tolerancia', 'Microalbúmina', 'Perfil Lipídico', 'Función Renal', 'Fondo de Ojo', 'Otro'],
        default: 'Otro',
    },
}, {
    timestamps: true,
});

// Index for better query performance
medicalExamSchema.index({ userId: 1, uploadDate: -1 });

module.exports = mongoose.model('MedicalExam', medicalExamSchema);