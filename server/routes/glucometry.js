/**
 * @swagger
 * tags:
 *   name: Glucometry
 *   description: Gestión de registros de glucometría
 */

const express = require('express');
const {
    createGlucometryRecord,
    getGlucometryRecords,
    getGlucometryRecord,
    updateGlucometryRecord,
    deleteGlucometryRecord,
    getGlucometryStats,
    getAllGlucometryRecords,
    getAllGlucometryStats,
    glucometryValidation
} = require('../controllers/glucometryController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/errorHandler');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

/**
 * @swagger
 * /api/records/glucometry:
 *   post:
 *     tags: [Glucometry]
 *     summary: Crear registro de glucometría
 *     description: Crear un nuevo registro de medición de glucosa
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reading
 *               - mealTime
 *             properties:
 *               reading:
 *                 type: number
 *                 minimum: 20
 *                 maximum: 600
 *                 example: 120
 *                 description: "Lectura de glucosa en mg/dL"
 *               mealTime:
 *                 type: string
 *                 enum: [fasting, breakfast, lunch, dinner, bedtime]
 *                 example: "fasting"
 *                 description: "Momento del día de la medición"
 *               notes:
 *                 type: string
 *                 maxLength: 500
 *                 example: "Me sentía un poco cansado"
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-01-15T08:00:00Z"
 *     responses:
 *       201:
 *         description: Registro creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         record:
 *                           $ref: '#/components/schemas/GlucometryRecord'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// @route   POST /api/records/glucometry
// @desc    Create glucometry record
// @access  Private
router.post('/', glucometryValidation, handleValidationErrors, createGlucometryRecord);

/**
 * @swagger
 * /api/records/glucometry:
 *   get:
 *     tags: [Glucometry]
 *     summary: Obtener registros de glucometría del usuario
 *     description: Obtener todos los registros de glucosa del usuario autenticado
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Registros por página
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de inicio (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha de fin (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Lista de registros de glucometría
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         records:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/GlucometryRecord'
 *                         pagination:
 *                           type: object
 *                           properties:
 *                             current:
 *                               type: integer
 *                             pages:
 *                               type: integer
 *                             total:
 *                               type: integer
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// @route   GET /api/records/glucometry
// @desc    Get user's glucometry records
// @access  Private
router.get('/', getGlucometryRecords);

// @route   GET /api/records/glucometry/stats
// @desc    Get glucometry statistics
// @access  Private
router.get('/stats', getGlucometryStats);

// @route   GET /api/records/glucometry/admin/all
// @desc    Get all glucometry records (admin only)
// @access  Admin
router.get('/admin/all', authorizeRole('admin'), getAllGlucometryRecords);

// @route   GET /api/records/glucometry/admin/stats
// @desc    Get all glucometry statistics (admin only)
// @access  Admin
router.get('/admin/stats', authorizeRole('admin'), getAllGlucometryStats);

// @route   GET /api/records/glucometry/:id
// @desc    Get single glucometry record
// @access  Private
router.get('/:id', getGlucometryRecord);

// @route   PUT /api/records/glucometry/:id
// @desc    Update glucometry record
// @access  Private
router.put('/:id', glucometryValidation, handleValidationErrors, updateGlucometryRecord);

// @route   DELETE /api/records/glucometry/:id
// @desc    Delete glucometry record
// @access  Private
router.delete('/:id', deleteGlucometryRecord);

module.exports = router;