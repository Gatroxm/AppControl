const express = require('express');
const {
    uploadMedicalExam,
    getMedicalExams,
    getMedicalExam,
    downloadMedicalExam,
    updateMedicalExam,
    deleteMedicalExam,
    getExamStats,
    getAllMedicalExams,
    getAllExamStats,
    examValidation
} = require('../controllers/examController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { upload, handleMulterError } = require('../middleware/upload');
const { handleValidationErrors } = require('../middleware/errorHandler');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// @route   POST /api/records/exams
// @desc    Upload medical exam
// @access  Private
router.post(
    '/',
    upload.single('examFile'),
    handleMulterError,
    examValidation,
    handleValidationErrors,
    uploadMedicalExam
);

// @route   GET /api/records/exams
// @desc    Get user's medical exams
// @access  Private
router.get('/', getMedicalExams);

// @route   GET /api/records/exams/stats
// @desc    Get exam statistics
// @access  Private
router.get('/stats', getExamStats);

// @route   GET /api/records/exams/admin/all
// @desc    Get all medical exams (admin only)
// @access  Admin
router.get('/admin/all', authorizeRole('admin'), getAllMedicalExams);

// @route   GET /api/records/exams/admin/stats
// @desc    Get all exam statistics (admin only)
// @access  Admin
router.get('/admin/stats', authorizeRole('admin'), getAllExamStats);

// @route   GET /api/records/exams/:id
// @desc    Get single medical exam
// @access  Private
router.get('/:id', getMedicalExam);

// @route   GET /api/records/exams/:id/download
// @desc    Download medical exam file
// @access  Private
router.get('/:id/download', downloadMedicalExam);

// @route   PUT /api/records/exams/:id
// @desc    Update medical exam metadata
// @access  Private
router.put('/:id', examValidation, handleValidationErrors, updateMedicalExam);

// @route   DELETE /api/records/exams/:id
// @desc    Delete medical exam
// @access  Private
router.delete('/:id', deleteMedicalExam);

module.exports = router;