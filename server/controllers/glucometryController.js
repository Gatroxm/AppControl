const GlucometryRecord = require('../models/GlucometryRecord');
const { body } = require('express-validator');

// Validation rules
const glucometryValidation = [
    body('date')
        .isISO8601()
        .withMessage('La fecha debe ser válida')
        .custom((value) => {
            if (new Date(value) > new Date()) {
                throw new Error('La fecha no puede ser futura');
            }
            return true;
        }),

    body('reading')
        .isNumeric()
        .withMessage('El valor de glucosa debe ser numérico')
        .isFloat({ min: 20, max: 600 })
        .withMessage('El valor de glucosa debe estar entre 20 y 600 mg/dL'),

    body('notes')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Las notas no pueden exceder 500 caracteres'),

    body('mealTime')
        .optional()
        .isIn(['Ayunas', 'Antes del desayuno', 'Después del desayuno', 'Antes del almuerzo', 'Después del almuerzo', 'Antes de la cena', 'Después de la cena', 'Antes de dormir', 'Otro'])
        .withMessage('Momento de comida inválido'),
];

// Create glucometry record
const createGlucometryRecord = async (req, res) => {
    try {
        const { date, reading, notes, mealTime } = req.body;

        const record = new GlucometryRecord({
            userId: req.user._id,
            date: new Date(date),
            reading: parseFloat(reading),
            notes: notes?.trim(),
            mealTime: mealTime || 'Otro',
        });

        await record.save();

        res.status(201).json({
            success: true,
            message: 'Registro de glucosa creado exitosamente',
            data: { record },
        });
    } catch (error) {
        console.error('Error en createGlucometryRecord:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
        });
    }
};

// Get user's glucometry records
const getGlucometryRecords = async (req, res) => {
    try {
        const { page = 1, limit = 10, startDate, endDate, mealTime } = req.query;

        // Build query
        const query = { userId: req.user._id };

        // Date range filter
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999); // End of day
                query.date.$lte = end;
            }
        }

        // Meal time filter
        if (mealTime) {
            query.mealTime = mealTime;
        }

        const records = await GlucometryRecord.find(query)
            .sort({ date: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await GlucometryRecord.countDocuments(query);

        res.json({
            success: true,
            data: {
                records,
                pagination: {
                    current: parseInt(page),
                    pages: Math.ceil(total / limit),
                    total,
                },
            },
        });
    } catch (error) {
        console.error('Error en getGlucometryRecords:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
        });
    }
};

// Get single glucometry record
const getGlucometryRecord = async (req, res) => {
    try {
        const { id } = req.params;

        const record = await GlucometryRecord.findOne({
            _id: id,
            userId: req.user._id,
        });

        if (!record) {
            return res.status(404).json({
                success: false,
                message: 'Registro no encontrado',
            });
        }

        res.json({
            success: true,
            data: { record },
        });
    } catch (error) {
        console.error('Error en getGlucometryRecord:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
        });
    }
};

// Update glucometry record
const updateGlucometryRecord = async (req, res) => {
    try {
        const { id } = req.params;
        const { date, reading, notes, mealTime } = req.body;

        const record = await GlucometryRecord.findOne({
            _id: id,
            userId: req.user._id,
        });

        if (!record) {
            return res.status(404).json({
                success: false,
                message: 'Registro no encontrado',
            });
        }

        // Update fields
        if (date) record.date = new Date(date);
        if (reading !== undefined) record.reading = parseFloat(reading);
        if (notes !== undefined) record.notes = notes.trim();
        if (mealTime) record.mealTime = mealTime;

        await record.save();

        res.json({
            success: true,
            message: 'Registro actualizado exitosamente',
            data: { record },
        });
    } catch (error) {
        console.error('Error en updateGlucometryRecord:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
        });
    }
};

// Delete glucometry record
const deleteGlucometryRecord = async (req, res) => {
    try {
        const { id } = req.params;

        const record = await GlucometryRecord.findOneAndDelete({
            _id: id,
            userId: req.user._id,
        });

        if (!record) {
            return res.status(404).json({
                success: false,
                message: 'Registro no encontrado',
            });
        }

        res.json({
            success: true,
            message: 'Registro eliminado exitosamente',
        });
    } catch (error) {
        console.error('Error en deleteGlucometryRecord:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
        });
    }
};

// Get glucometry statistics
const getGlucometryStats = async (req, res) => {
    try {
        const { period = '30' } = req.query; // days
        const daysAgo = parseInt(period);

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - daysAgo);

        const records = await GlucometryRecord.find({
            userId: req.user._id,
            date: { $gte: startDate },
        }).sort({ date: 1 });

        if (records.length === 0) {
            return res.json({
                success: true,
                data: {
                    stats: {
                        totalRecords: 0,
                        averageReading: 0,
                        highReadings: 0,
                        lowReadings: 0,
                        normalReadings: 0,
                    },
                    chartData: [],
                },
            });
        }

        // Calculate statistics
        const readings = records.map(r => r.reading);
        const totalRecords = readings.length;
        const averageReading = readings.reduce((a, b) => a + b, 0) / totalRecords;

        // Count readings by range (normal: 70-140, high: >140, low: <70)
        const highReadings = readings.filter(r => r > 140).length;
        const lowReadings = readings.filter(r => r < 70).length;
        const normalReadings = totalRecords - highReadings - lowReadings;

        // Prepare chart data
        const chartData = records.map(record => ({
            date: record.date.toISOString().split('T')[0],
            reading: record.reading,
            mealTime: record.mealTime,
        }));

        res.json({
            success: true,
            data: {
                stats: {
                    totalRecords,
                    averageReading: Math.round(averageReading * 100) / 100,
                    highReadings,
                    lowReadings,
                    normalReadings,
                    period: daysAgo,
                },
                chartData,
            },
        });
    } catch (error) {
        console.error('Error en getGlucometryStats:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
        });
    }
};

// Admin function to get all glucometry records
const getAllGlucometryRecords = async (req, res) => {
    try {
        const { page = 1, limit = 50, startDate, endDate, userId } = req.query;

        // Only allow admins
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Acceso denegado. Se requieren privilegios de administrador.'
            });
        }

        // Build query
        const query = {};

        // User filter for admin
        if (userId) {
            query.userId = userId;
        }

        // Date range filter
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                query.date.$lte = end;
            }
        }

        const records = await GlucometryRecord.find(query)
            .populate('userId', 'name email')
            .sort({ date: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await GlucometryRecord.countDocuments(query);

        res.json({
            success: true,
            data: {
                records,
                pagination: {
                    current: parseInt(page),
                    pages: Math.ceil(total / limit),
                    total,
                }
            }
        });
    } catch (error) {
        console.error('Error en getAllGlucometryRecords:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Admin function to get all glucometry stats
const getAllGlucometryStats = async (req, res) => {
    try {
        // Only allow admins
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Acceso denegado. Se requieren privilegios de administrador.'
            });
        }

        const { period = 30 } = req.query;
        const daysAgo = parseInt(period);
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - daysAgo);

        const records = await GlucometryRecord.find({
            date: { $gte: startDate }
        }).populate('userId', 'name email');

        const totalRecords = records.length;
        if (totalRecords === 0) {
            return res.json({
                success: true,
                data: {
                    stats: {
                        totalRecords: 0,
                        averageReading: 0,
                        highReadings: 0,
                        lowReadings: 0,
                        normalReadings: 0,
                        period: daysAgo,
                        totalUsers: 0,
                    }
                }
            });
        }

        const readings = records.map(r => r.reading);
        const averageReading = readings.reduce((sum, reading) => sum + reading, 0) / totalRecords;
        const highReadings = readings.filter(r => r > 180).length;
        const lowReadings = readings.filter(r => r < 70).length;
        const normalReadings = totalRecords - highReadings - lowReadings;

        const uniqueUsers = new Set(records.map(r => r.userId._id.toString())).size;

        res.json({
            success: true,
            data: {
                stats: {
                    totalRecords,
                    averageReading: Math.round(averageReading * 100) / 100,
                    highReadings,
                    lowReadings,
                    normalReadings,
                    period: daysAgo,
                    totalUsers: uniqueUsers,
                }
            }
        });
    } catch (error) {
        console.error('Error en getAllGlucometryStats:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

module.exports = {
    createGlucometryRecord,
    getGlucometryRecords,
    getGlucometryRecord,
    updateGlucometryRecord,
    deleteGlucometryRecord,
    getGlucometryStats,
    getAllGlucometryRecords,
    getAllGlucometryStats,
    glucometryValidation,
};