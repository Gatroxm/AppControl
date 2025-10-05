const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    editorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El ID del editor es requerido'],
    },
    title: {
        type: String,
        required: [true, 'El título es requerido'],
        trim: true,
        maxlength: [200, 'El título no puede exceder 200 caracteres'],
    },
    description: {
        type: String,
        required: [true, 'La descripción es requerida'],
        minlength: [50, 'La descripción debe tener al menos 50 caracteres'],
    },
    imageUrl: {
        type: String,
        required: [true, 'La URL de la imagen es requerida'],
    },
    ingredients: [{
        type: String,
        required: true,
        trim: true,
        maxlength: [200, 'Cada ingrediente no puede exceder 200 caracteres'],
    }],
    instructions: {
        type: String,
        required: [true, 'Las instrucciones son requeridas'],
        minlength: [50, 'Las instrucciones deben tener al menos 50 caracteres'],
    },
    prepTime: {
        type: Number,
        required: [true, 'El tiempo de preparación es requerido'],
        min: [1, 'El tiempo mínimo es 1 minuto'],
        max: [600, 'El tiempo máximo es 600 minutos (10 horas)'],
    },
    servings: {
        type: Number,
        required: [true, 'El número de porciones es requerido'],
        min: [1, 'Mínimo 1 porción'],
        max: [50, 'Máximo 50 porciones'],
    },
    tags: [{
        type: String,
        trim: true,
        lowercase: true,
    }],
    difficulty: {
        type: String,
        enum: ['Fácil', 'Intermedio', 'Difícil'],
        default: 'Fácil',
    },
    nutritionInfo: {
        calories: { type: Number, min: 0 },
        carbohydrates: { type: Number, min: 0 },
        proteins: { type: Number, min: 0 },
        fats: { type: Number, min: 0 },
        fiber: { type: Number, min: 0 },
    },
    publishDate: {
        type: Date,
        required: [true, 'La fecha de publicación es requerida'],
        default: Date.now,
    },
    isPublished: {
        type: Boolean,
        default: true,
    },
    views: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

// Index for better search performance
recipeSchema.index({ title: 'text', description: 'text', tags: 'text' });
recipeSchema.index({ isPublished: 1, publishDate: -1 });
recipeSchema.index({ editorId: 1, publishDate: -1 });

module.exports = mongoose.model('Recipe', recipeSchema);