/**
 * @swagger
 * tags:
 *   name: Recipes
 *   description: Gestión de recetas saludables
 */

const express = require('express');
const {
    createRecipe,
    getRecipes,
    getRecipe,
    getMyRecipes,
    updateRecipe,
    deleteRecipe,
    getRecipeStats,
    getPopularTags,
    getAllRecipes,
    getAllRecipeStats,
    recipeValidation
} = require('../controllers/recipeController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { upload, handleMulterError } = require('../middleware/upload');
const { handleValidationErrors } = require('../middleware/errorHandler');

const router = express.Router();

/**
 * @swagger
 * /api/recipes:
 *   get:
 *     tags: [Recipes]
 *     summary: Obtener recetas publicadas
 *     description: Obtener todas las recetas públicas disponibles
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
 *           maximum: 50
 *           default: 12
 *         description: Recetas por página
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *           enum: [Fácil, Intermedio, Difícil]
 *         description: Filtrar por dificultad
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: Filtrar por etiquetas (separadas por coma)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Búsqueda en título y descripción
 *     responses:
 *       200:
 *         description: Lista de recetas
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
 *                         recipes:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Recipe'
 *                         pagination:
 *                           type: object
 *                           properties:
 *                             current:
 *                               type: integer
 *                             pages:
 *                               type: integer
 *                             total:
 *                               type: integer
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// @route   GET /api/recipes
// @desc    Get all published recipes
// @access  Public
router.get('/', getRecipes);

/**
 * @swagger
 * /api/recipes/tags:
 *   get:
 *     tags: [Recipes]
 *     summary: Obtener etiquetas populares
 *     description: Obtener las etiquetas más utilizadas en las recetas
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 20
 *         description: Número máximo de etiquetas
 *     responses:
 *       200:
 *         description: Lista de etiquetas populares
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
 *                         tags:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               tag:
 *                                 type: string
 *                                 example: "vegetariano"
 *                               count:
 *                                 type: integer
 *                                 example: 15
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// @route   GET /api/recipes/tags
// @desc    Get popular tags
// @access  Public
router.get('/tags', getPopularTags);

// Admin routes (need authentication)
router.use('/admin', authenticateToken, authorizeRole('admin'));

// @route   GET /api/recipes/admin/all
// @desc    Get all recipes (admin only)
// @access  Admin
router.get('/admin/all', getAllRecipes);

// @route   GET /api/recipes/admin/stats
// @desc    Get all recipe statistics (admin only)
// @access  Admin
router.get('/admin/stats', getAllRecipeStats);

// @route   GET /api/recipes/:id
// @desc    Get single recipe
// @access  Public
router.get('/:id', getRecipe);

// Protected routes (require authentication)
router.use(authenticateToken);

// @route   GET /api/recipes/my/list
// @desc    Get user's own recipes
// @access  Private (Editor/Admin)
router.get('/my/list', authorizeRole('editor', 'admin'), getMyRecipes);

// @route   GET /api/recipes/my/stats
// @desc    Get recipe statistics
// @access  Private (Editor/Admin)
router.get('/my/stats', authorizeRole('editor', 'admin'), getRecipeStats);



// @route   POST /api/recipes
// @desc    Create new recipe
// @access  Private (Editor/Admin)
router.post(
    '/',
    authorizeRole('editor', 'admin'),
    upload.single('recipeImage'),
    handleMulterError,
    recipeValidation,
    handleValidationErrors,
    createRecipe
);

// @route   PUT /api/recipes/:id
// @desc    Update recipe
// @access  Private (Editor/Admin - own recipes only, Admin - any recipe)
router.put(
    '/:id',
    authorizeRole('editor', 'admin'),
    upload.single('recipeImage'),
    handleMulterError,
    recipeValidation,
    handleValidationErrors,
    updateRecipe
);

// @route   DELETE /api/recipes/:id
// @desc    Delete recipe
// @access  Private (Editor/Admin - own recipes only, Admin - any recipe)
router.delete('/:id', authorizeRole('editor', 'admin'), deleteRecipe);

module.exports = router;