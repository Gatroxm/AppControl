const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre completo es requerido'],
        trim: true,
        maxlength: [100, 'El nombre no puede exceder 100 caracteres'],
    },
    email: {
        type: String,
        required: [true, 'El email es requerido'],
        unique: true,
        lowercase: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Por favor ingresa un email válido',
        ],
    },
    password: {
        type: String,
        required: [true, 'La contraseña es requerida'],
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    },
    role: {
        type: String,
        enum: ['admin', 'editor', 'user'],
        default: 'user',
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    profile: {
        age: {
            type: Number,
            min: [1, 'La edad debe ser mayor a 0'],
            max: [150, 'La edad debe ser menor a 150'],
        },
        height: {
            type: Number,
            min: [50, 'La altura debe ser mayor a 50cm'],
            max: [300, 'La altura debe ser menor a 300cm'],
        },
        weight: {
            type: Number,
            min: [20, 'El peso debe ser mayor a 20kg'],
            max: [500, 'El peso debe ser menor a 500kg'],
        },
        diabetesType: {
            type: String,
            enum: ['Tipo 1', 'Tipo 2', 'Gestacional', 'MODY', 'Otro'],
        },
        diagnosis_date: {
            type: Date,
        },
        currentMedication: {
            type: String,
            maxlength: [500, 'La medicación no puede exceder 500 caracteres'],
        },
        emergencyContact: {
            type: String,
            maxlength: [100, 'El contacto de emergencia no puede exceder 100 caracteres'],
        },
        emergencyPhone: {
            type: String,
            maxlength: [20, 'El teléfono no puede exceder 20 caracteres'],
        },
    },
}, {
    timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
};

module.exports = mongoose.model('User', userSchema);