const mongoose = require('mongoose');

const glucometryRecordSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El ID del usuario es requerido'],
    },
    date: {
        type: Date,
        required: [true, 'La fecha es requerida'],
        validate: {
            validator: function (value) {
                return value <= new Date();
            },
            message: 'La fecha no puede ser futura',
        },
    },
    reading: {
        type: Number,
        required: [true, 'El valor de glucosa es requerido'],
        min: [20, 'El valor mínimo es 20 mg/dL'],
        max: [600, 'El valor máximo es 600 mg/dL'],
    },
    notes: {
        type: String,
        maxlength: [500, 'Las notas no pueden exceder 500 caracteres'],
        trim: true,
    },
    mealTime: {
        type: String,
        enum: ['Ayunas', 'Antes del desayuno', 'Después del desayuno', 'Antes del almuerzo', 'Después del almuerzo', 'Antes de la cena', 'Después de la cena', 'Antes de dormir', 'Otro'],
        default: 'Otro',
    },
}, {
    timestamps: true,
});

// Index for better query performance
glucometryRecordSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('GlucometryRecord', glucometryRecordSchema);