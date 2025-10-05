const MedicalExam = require('../models/MedicalExam');
const { body } = require('express-validator');
const path = require('path');
const fs = require('fs');

// Validation rules
const examValidation = [
    body('title')
        .notEmpty()
        .withMessage('El título es requerido')
        .isLength({ max: 200 })
        .withMessage('El título no puede exceder 200 caracteres'),

    body('examDate')
        .optional()
        .isISO8601()
        .withMessage('La fecha del examen debe ser válida')
        .custom((value) => {
            if (value && new Date(value) > new Date()) {
                throw new Error('La fecha del examen no puede ser futura');
            }
            return true;
        }),

    body('examType')
        .optional()
        .isIn(['Hemoglobina Glicosilada', 'Glucosa en Ayunas', 'Curva de Tolerancia', 'Microalbúmina', 'Perfil Lipídico', 'Función Renal', 'Fondo de Ojo', 'Otro'])
        .withMessage('Tipo de examen inválido'),
];

// Upload medical exam
const uploadMedicalExam = async (req, res) => {
    try {
        const { title, examDate, examType } = req.body;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Archivo requerido',
            });
        }

        // Create file URL
        const fileUrl = `/uploads/exams/${req.file.filename}`;

        const exam = new MedicalExam({
            userId: req.user._id,
            title: title.trim(),
            fileUrl,
            originalName: req.file.originalname,
            fileSize: req.file.size,
            mimeType: req.file.mimetype,
            examDate: examDate ? new Date(examDate) : undefined,
            examType: examType || 'Otro',
        });

        await exam.save();

        res.status(201).json({
            success: true,
            message: 'Examen médico subido exitosamente',
            data: { exam },
        });
    } catch (error) {
        // Delete uploaded file if database save fails
        if (req.file) {
            const filePath = req.file.path;
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        console.error('Error en uploadMedicalExam:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
        });
    }
};

// Get user's medical exams
const getMedicalExams = async (req, res) => {
    try {
        const { page = 1, limit = 10, examType, startDate, endDate } = req.query;

        // Build query
        const query = { userId: req.user._id };

        // Exam type filter
        if (examType) {
            query.examType = examType;
        }

        // Date range filter
        if (startDate || endDate) {
            query.uploadDate = {};
            if (startDate) query.uploadDate.$gte = new Date(startDate);
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                query.uploadDate.$lte = end;
            }
        }

        const exams = await MedicalExam.find(query)
            .sort({ uploadDate: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await MedicalExam.countDocuments(query);

        res.json({
            success: true,
            data: {
                exams,
                pagination: {
                    current: parseInt(page),
                    pages: Math.ceil(total / limit),
                    total,
                },
            },
        });
    } catch (error) {
        console.error('Error en getMedicalExams:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
        });
    }
};

// Get single medical exam
const getMedicalExam = async (req, res) => {
    try {
        const { id } = req.params;

        const exam = await MedicalExam.findOne({
            _id: id,
            userId: req.user._id,
        });

        if (!exam) {
            return res.status(404).json({
                success: false,
                message: 'Examen no encontrado',
            });
        }

        res.json({
            success: true,
            data: { exam },
        });
    } catch (error) {
        console.error('Error en getMedicalExam:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
        });
    }
};

// Download medical exam file
const downloadMedicalExam = async (req, res) => {
    try {
        const { id } = req.params;

        const exam = await MedicalExam.findOne({
            _id: id,
            userId: req.user._id,
        });

        if (!exam) {
            return res.status(404).json({
                success: false,
                message: 'Examen no encontrado',
            });
        }

        const filePath = path.join(__dirname, '..', exam.fileUrl);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: 'Archivo no encontrado',
            });
        }

        // Set appropriate headers
        res.setHeader('Content-Disposition', `attachment; filename="${exam.originalName}"`);
        res.setHeader('Content-Type', exam.mimeType);

        // Send file
        res.sendFile(filePath);
    } catch (error) {
        console.error('Error en downloadMedicalExam:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
        });
    }
};

// Update medical exam metadata
const updateMedicalExam = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, examDate, examType } = req.body;

        const exam = await MedicalExam.findOne({
            _id: id,
            userId: req.user._id,
        });

        if (!exam) {
            return res.status(404).json({
                success: false,
                message: 'Examen no encontrado',
            });
        }

        // Update fields
        if (title) exam.title = title.trim();
        if (examDate !== undefined) exam.examDate = examDate ? new Date(examDate) : undefined;
        if (examType) exam.examType = examType;

        await exam.save();

        res.json({
            success: true,
            message: 'Examen actualizado exitosamente',
            data: { exam },
        });
    } catch (error) {
        console.error('Error en updateMedicalExam:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
        });
    }
};

// Delete medical exam
const deleteMedicalExam = async (req, res) => {
    try {
        const { id } = req.params;

        const exam = await MedicalExam.findOne({
            _id: id,
            userId: req.user._id,
        });

        if (!exam) {
            return res.status(404).json({
                success: false,
                message: 'Examen no encontrado',
            });
        }

        // Delete file from filesystem
        const filePath = path.join(__dirname, '..', exam.fileUrl);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Delete from database
        await MedicalExam.findByIdAndDelete(id);

        res.json({
            success: true,
            message: 'Examen eliminado exitosamente',
        });
    } catch (error) {
        console.error('Error en deleteMedicalExam:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
        });
    }
};

// Get exam statistics
const getExamStats = async (req, res) => {
    try {
        const userId = req.user._id;

        const totalExams = await MedicalExam.countDocuments({ userId });

        // Count by exam type
        const examsByType = await MedicalExam.aggregate([
            { $match: { userId } },
            { $group: { _id: '$examType', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);

        // Recent exams (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentExams = await MedicalExam.countDocuments({
            userId,
            uploadDate: { $gte: thirtyDaysAgo },
        });

        // Storage usage
        const storageStats = await MedicalExam.aggregate([
            { $match: { userId } },
            { $group: { _id: null, totalSize: { $sum: '$fileSize' } } },
        ]);

        const totalSizeBytes = storageStats[0]?.totalSize || 0;
        const totalSizeMB = Math.round((totalSizeBytes / (1024 * 1024)) * 100) / 100;

        res.json({
            success: true,
            data: {
                stats: {
                    totalExams,
                    recentExams,
                    totalSizeMB,
                    examsByType,
                },
            },
        });
    } catch (error) {
        console.error('Error en getExamStats:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
        });
    }
};

// Admin function to get all medical exams
const getAllMedicalExams = async (req, res) => {
    try {
        // Only allow admins
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Acceso denegado. Se requieren privilegios de administrador.'
            });
        }

        const { page = 1, limit = 50, examType, userId, startDate, endDate } = req.query;

        // Build query
        const query = {};

        if (userId) {
            query.userId = userId;
        }

        if (examType) {
            query.examType = examType;
        }

        if (startDate || endDate) {
            query.uploadDate = {};
            if (startDate) query.uploadDate.$gte = new Date(startDate);
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                query.uploadDate.$lte = end;
            }
        }

        const exams = await MedicalExam.find(query)
            .populate('userId', 'name email')
            .sort({ uploadDate: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await MedicalExam.countDocuments(query);

        res.json({
            success: true,
            data: {
                exams,
                pagination: {
                    current: parseInt(page),
                    pages: Math.ceil(total / limit),
                    total,
                }
            }
        });
    } catch (error) {
        console.error('Error en getAllMedicalExams:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Admin function to get all exam statistics
const getAllExamStats = async (req, res) => {
    try {
        // Only allow admins
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Acceso denegado. Se requieren privilegios de administrador.'
            });
        }

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const totalExams = await MedicalExam.countDocuments({});
        const recentExams = await MedicalExam.countDocuments({
            uploadDate: { $gte: thirtyDaysAgo }
        });

        // Exams by type
        const examsByType = await MedicalExam.aggregate([
            {
                $group: {
                    _id: '$examType',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // Storage usage
        const storageStats = await MedicalExam.aggregate([
            { $group: { _id: null, totalSize: { $sum: '$fileSize' } } }
        ]);

        const totalSizeBytes = storageStats[0]?.totalSize || 0;
        const totalSizeMB = Math.round((totalSizeBytes / (1024 * 1024)) * 100) / 100;

        // Total users with exams
        const totalUsersWithExams = await MedicalExam.distinct('userId').then(users => users.length);

        res.json({
            success: true,
            data: {
                stats: {
                    totalExams,
                    recentExams,
                    totalSizeMB,
                    examsByType,
                    totalUsersWithExams,
                }
            }
        });
    } catch (error) {
        console.error('Error en getAllExamStats:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

module.exports = {
    uploadMedicalExam,
    getMedicalExams,
    getMedicalExam,
    downloadMedicalExam,
    updateMedicalExam,
    deleteMedicalExam,
    getExamStats,
    getAllMedicalExams,
    getAllExamStats,
    examValidation,
};