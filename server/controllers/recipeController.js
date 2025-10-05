const Recipe = require('../models/Recipe');
const { body } = require('express-validator');
const path = require('path');
const fs = require('fs');

// Validation rules
const recipeValidation = [
    body('title')
        .notEmpty()
        .withMessage('El título es requerido')
        .isLength({ max: 200 })
        .withMessage('El título no puede exceder 200 caracteres'),

    body('description')
        .isLength({ min: 50 })
        .withMessage('La descripción debe tener al menos 50 caracteres'),

    body('instructions')
        .isLength({ min: 50 })
        .withMessage('Las instrucciones deben tener al menos 50 caracteres'),

    body('ingredients')
        .isArray({ min: 1 })
        .withMessage('Debe incluir al menos un ingrediente'),

    body('ingredients.*')
        .notEmpty()
        .withMessage('Los ingredientes no pueden estar vacíos')
        .isLength({ max: 200 })
        .withMessage('Cada ingrediente no puede exceder 200 caracteres'),

    body('prepTime')
        .isInt({ min: 1, max: 600 })
        .withMessage('El tiempo de preparación debe estar entre 1 y 600 minutos'),

    body('servings')
        .isInt({ min: 1, max: 50 })
        .withMessage('Las porciones deben estar entre 1 y 50'),

    body('difficulty')
        .optional()
        .isIn(['Fácil', 'Intermedio', 'Difícil'])
        .withMessage('La dificultad debe ser Fácil, Intermedio o Difícil'),
];

// Create recipe (Editor/Admin only)
const createRecipe = async (req, res) => {
    try {
        const {
            title,
            description,
            instructions,
            ingredients,
            prepTime,
            servings,
            difficulty,
            tags,
            nutritionInfo
        } = req.body;

        let imageUrl = '';
        if (req.file) {
            imageUrl = `/uploads/recipes/${req.file.filename}`;
        }

        const recipe = new Recipe({
            editorId: req.user._id,
            title: title.trim(),
            description: description.trim(),
            instructions: instructions.trim(),
            imageUrl,
            ingredients: Array.isArray(ingredients) ? ingredients.map(i => i.trim()) : [],
            prepTime: parseInt(prepTime),
            servings: parseInt(servings),
            difficulty: difficulty || 'Fácil',
            tags: tags ? tags.split(',').map(t => t.trim().toLowerCase()) : [],
            nutritionInfo: nutritionInfo ? JSON.parse(nutritionInfo) : undefined,
        });

        await recipe.save();
        await recipe.populate('editorId', 'username');

        res.status(201).json({
            success: true,
            message: 'Receta creada exitosamente',
            data: { recipe },
        });
    } catch (error) {
        // Delete uploaded image if database save fails
        if (req.file) {
            const filePath = req.file.path;
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        console.error('Error en createRecipe:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
        });
    }
};

// Get all recipes (Public)
const getRecipes = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 12,
            search,
            tag,
            difficulty,
            sortBy = 'publishDate',
            order = 'desc'
        } = req.query;

        // Build query
        const query = { isPublished: true };

        if (search) {
            query.$text = { $search: search };
        }

        if (tag) {
            query.tags = { $in: [tag.toLowerCase()] };
        }

        if (difficulty) {
            query.difficulty = difficulty;
        }

        // Build sort object
        const sort = {};
        sort[sortBy] = order === 'asc' ? 1 : -1;

        const recipes = await Recipe.find(query)
            .populate('editorId', 'username')
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Recipe.countDocuments(query);

        res.json({
            success: true,
            data: {
                recipes,
                pagination: {
                    current: parseInt(page),
                    pages: Math.ceil(total / limit),
                    total,
                },
            },
        });
    } catch (error) {
        console.error('Error en getRecipes:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
        });
    }
};

// Get single recipe (Public)
const getRecipe = async (req, res) => {
    try {
        const { id } = req.params;

        const recipe = await Recipe.findOne({
            _id: id,
            isPublished: true,
        }).populate('editorId', 'username');

        if (!recipe) {
            return res.status(404).json({
                success: false,
                message: 'Receta no encontrada',
            });
        }

        // Increment view count
        recipe.views += 1;
        await recipe.save();

        res.json({
            success: true,
            data: { recipe },
        });
    } catch (error) {
        console.error('Error en getRecipe:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
        });
    }
};

// Get user's own recipes (Editor/Admin)
const getMyRecipes = async (req, res) => {
    try {
        const { page = 1, limit = 10, isPublished } = req.query;

        // Build query
        const query = { editorId: req.user._id };

        if (isPublished !== undefined) {
            query.isPublished = isPublished === 'true';
        }

        const recipes = await Recipe.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Recipe.countDocuments(query);

        res.json({
            success: true,
            data: {
                recipes,
                pagination: {
                    current: parseInt(page),
                    pages: Math.ceil(total / limit),
                    total,
                },
            },
        });
    } catch (error) {
        console.error('Error en getMyRecipes:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
        });
    }
};

// Update recipe (Editor/Admin)
const updateRecipe = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            description,
            instructions,
            ingredients,
            prepTime,
            servings,
            difficulty,
            tags,
            nutritionInfo,
            isPublished
        } = req.body;

        // Find recipe
        const recipe = await Recipe.findById(id);

        if (!recipe) {
            return res.status(404).json({
                success: false,
                message: 'Receta no encontrada',
            });
        }

        // Check ownership (Editor can only edit own recipes, Admin can edit any)
        if (req.user.role !== 'Admin' && recipe.editorId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para editar esta receta',
            });
        }

        // Handle image update
        let imageUrl = recipe.imageUrl;
        if (req.file) {
            // Delete old image
            const oldImagePath = path.join(__dirname, '..', recipe.imageUrl);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
            imageUrl = `/uploads/recipes/${req.file.filename}`;
        }

        // Update fields
        if (title) recipe.title = title.trim();
        if (description) recipe.description = description.trim();
        if (instructions) recipe.instructions = instructions.trim();
        if (imageUrl) recipe.imageUrl = imageUrl;
        if (ingredients) recipe.ingredients = Array.isArray(ingredients) ? ingredients.map(i => i.trim()) : [];
        if (prepTime) recipe.prepTime = parseInt(prepTime);
        if (servings) recipe.servings = parseInt(servings);
        if (difficulty) recipe.difficulty = difficulty;
        if (tags) recipe.tags = tags.split(',').map(t => t.trim().toLowerCase());
        if (nutritionInfo) recipe.nutritionInfo = JSON.parse(nutritionInfo);
        if (isPublished !== undefined) recipe.isPublished = isPublished === 'true';

        await recipe.save();
        await recipe.populate('editorId', 'username');

        res.json({
            success: true,
            message: 'Receta actualizada exitosamente',
            data: { recipe },
        });
    } catch (error) {
        console.error('Error en updateRecipe:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
        });
    }
};

// Delete recipe (Editor/Admin)
const deleteRecipe = async (req, res) => {
    try {
        const { id } = req.params;

        const recipe = await Recipe.findById(id);

        if (!recipe) {
            return res.status(404).json({
                success: false,
                message: 'Receta no encontrada',
            });
        }

        // Check ownership (Editor can only delete own recipes, Admin can delete any)
        if (req.user.role !== 'Admin' && recipe.editorId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para eliminar esta receta',
            });
        }

        // Delete image file
        const imagePath = path.join(__dirname, '..', recipe.imageUrl);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        // Delete from database
        await Recipe.findByIdAndDelete(id);

        res.json({
            success: true,
            message: 'Receta eliminada exitosamente',
        });
    } catch (error) {
        console.error('Error en deleteRecipe:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
        });
    }
};

// Get recipe statistics (Editor/Admin for own stats, Admin for all)
const getRecipeStats = async (req, res) => {
    try {
        const isAdmin = req.user.role === 'Admin';
        const query = isAdmin ? {} : { editorId: req.user._id };

        const totalRecipes = await Recipe.countDocuments(query);
        const publishedRecipes = await Recipe.countDocuments({ ...query, isPublished: true });
        const draftRecipes = await Recipe.countDocuments({ ...query, isPublished: false });

        // Total views
        const viewsStats = await Recipe.aggregate([
            { $match: query },
            { $group: { _id: null, totalViews: { $sum: '$views' } } },
        ]);
        const totalViews = viewsStats[0]?.totalViews || 0;

        // Most popular recipes
        const popularRecipes = await Recipe.find({ ...query, isPublished: true })
            .populate('editorId', 'username')
            .sort({ views: -1 })
            .limit(5)
            .select('title views imageUrl');

        // Recipes by difficulty
        const difficultyStats = await Recipe.aggregate([
            { $match: { ...query, isPublished: true } },
            { $group: { _id: '$difficulty', count: { $sum: 1 } } },
        ]);

        res.json({
            success: true,
            data: {
                stats: {
                    totalRecipes,
                    publishedRecipes,
                    draftRecipes,
                    totalViews,
                    difficultyStats,
                    popularRecipes,
                },
            },
        });
    } catch (error) {
        console.error('Error en getRecipeStats:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
        });
    }
};

// Get popular tags
const getPopularTags = async (req, res) => {
    try {
        const tags = await Recipe.aggregate([
            { $match: { isPublished: true } },
            { $unwind: '$tags' },
            { $group: { _id: '$tags', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 20 },
        ]);

        res.json({
            success: true,
            data: { tags },
        });
    } catch (error) {
        console.error('Error en getPopularTags:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
        });
    }
};

// Admin function to get all recipes
const getAllRecipes = async (req, res) => {
    try {
        // Only allow admins
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Acceso denegado. Se requieren privilegios de administrador.'
            });
        }

        const {
            page = 1,
            limit = 50,
            difficulty,
            editorId,
            isPublished,
            startDate,
            endDate
        } = req.query;

        // Build query
        const query = {};

        if (editorId) {
            query.editorId = editorId;
        }

        if (difficulty) {
            query.difficulty = difficulty;
        }

        if (isPublished !== undefined) {
            query.isPublished = isPublished === 'true';
        }

        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                query.createdAt.$lte = end;
            }
        }

        const recipes = await Recipe.find(query)
            .populate('editorId', 'name email')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Recipe.countDocuments(query);

        res.json({
            success: true,
            data: {
                recipes,
                pagination: {
                    current: parseInt(page),
                    pages: Math.ceil(total / limit),
                    total,
                }
            }
        });
    } catch (error) {
        console.error('Error en getAllRecipes:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Admin function to get all recipe statistics
const getAllRecipeStats = async (req, res) => {
    try {
        // Only allow admins
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Acceso denegado. Se requieren privilegios de administrador.'
            });
        }

        const totalRecipes = await Recipe.countDocuments({});
        const publishedRecipes = await Recipe.countDocuments({ isPublished: true });
        const draftRecipes = await Recipe.countDocuments({ isPublished: false });

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentRecipes = await Recipe.countDocuments({
            createdAt: { $gte: thirtyDaysAgo }
        });

        // Recipes by difficulty
        const recipesByDifficulty = await Recipe.aggregate([
            {
                $group: {
                    _id: '$difficulty',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        // Most active authors
        const topAuthors = await Recipe.aggregate([
            {
                $group: {
                    _id: '$authorId',
                    recipeCount: { $sum: 1 }
                }
            },
            { $sort: { recipeCount: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'author'
                }
            },
            { $unwind: '$author' },
            {
                $project: {
                    authorName: '$author.name',
                    authorEmail: '$author.email',
                    recipeCount: 1
                }
            }
        ]);

        // Total authors with recipes
        const totalAuthors = await Recipe.distinct('authorId').then(authors => authors.length);

        res.json({
            success: true,
            data: {
                stats: {
                    totalRecipes,
                    publishedRecipes,
                    draftRecipes,
                    recentRecipes,
                    recipesByDifficulty,
                    topAuthors,
                    totalAuthors,
                }
            }
        });
    } catch (error) {
        console.error('Error en getAllRecipeStats:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

module.exports = {
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
    recipeValidation,
};