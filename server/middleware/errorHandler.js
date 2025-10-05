const { validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Errores de validación',
            errors: errors.array().map(error => ({
                field: error.path,
                message: error.msg,
                value: error.value,
            })),
        });
    }

    next();
};

const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // MongoDB duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(400).json({
            success: false,
            message: `El ${field} ya está en uso`,
        });
    }

    // MongoDB validation error
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(error => ({
            field: error.path,
            message: error.message,
        }));

        return res.status(400).json({
            success: false,
            message: 'Errores de validación',
            errors,
        });
    }

    // MongoDB cast error
    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: 'ID inválido',
        });
    }

    // Default error
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Error interno del servidor',
    });
};

const notFound = (req, res) => {
    res.status(404).json({
        success: false,
        message: `Ruta ${req.originalUrl} no encontrada`,
    });
};

module.exports = {
    handleValidationErrors,
    errorHandler,
    notFound,
};