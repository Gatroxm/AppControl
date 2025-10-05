const User = require('../models/User');
const { generateToken } = require('../config/jwt');
const { body } = require('express-validator');

// Validation rules
const registerValidation = [
    body('username')
        .isLength({ min: 3, max: 30 })
        .withMessage('El nombre de usuario debe tener entre 3 y 30 caracteres')
        .isAlphanumeric('es-ES', { ignore: '_-' })
        .withMessage('El nombre de usuario solo puede contener letras, números, guiones y guiones bajos'),

    body('email')
        .isEmail()
        .withMessage('Debe ser un email válido')
        .normalizeEmail(),

    body('password')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('La contraseña debe contener al menos una minúscula, una mayúscula y un número'),
];

const loginValidation = [
    body('email')
        .isEmail()
        .withMessage('Debe ser un email válido')
        .normalizeEmail(),

    body('password')
        .notEmpty()
        .withMessage('La contraseña es requerida'),
];

// Register user
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'El usuario ya existe con ese email o nombre de usuario',
            });
        }

        // Create new user
        const user = new User({
            username,
            email,
            password,
        });

        await user.save();

        // Generate token
        const token = generateToken({
            userId: user._id,
            role: user.role
        });

        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            data: {
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                },
            },
        });
    } catch (error) {
        console.error('Error en register:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
        });
    }
};

// Login user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email }).select('+password');

        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas',
            });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas',
            });
        }

        // Generate token
        const token = generateToken({
            userId: user._id,
            role: user.role
        });

        res.json({
            success: true,
            message: 'Inicio de sesión exitoso',
            data: {
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                },
            },
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
        });
    }
};

// Get current user
const getMe = async (req, res) => {
    try {
        // Get fresh user data from database to ensure it's up to date
        const user = await User.findById(req.user._id).select('-password');

        if (!user || !user.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado o inactivo'
            });
        }

        res.json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    isActive: user.isActive,
                    createdAt: user.createdAt,
                },
            },
        });
    } catch (error) {
        console.error('Error en getMe:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
        });
    }
};

// Update profile
const updateProfile = async (req, res) => {
    try {
        const { username, email } = req.body;
        const userId = req.user._id;

        // Check if username/email is already taken by another user
        if (username || email) {
            const existingUser = await User.findOne({
                _id: { $ne: userId },
                $or: [
                    ...(username ? [{ username }] : []),
                    ...(email ? [{ email }] : []),
                ],
            });

            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'El nombre de usuario o email ya está en uso',
                });
            }
        }

        const updateData = {};
        if (username) updateData.username = username;
        if (email) updateData.email = email;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: 'Perfil actualizado exitosamente',
            data: {
                user: {
                    id: updatedUser._id,
                    username: updatedUser.username,
                    email: updatedUser.email,
                    role: updatedUser.role,
                },
            },
        });
    } catch (error) {
        console.error('Error en updateProfile:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
        });
    }
};

module.exports = {
    register,
    login,
    getMe,
    updateProfile,
    registerValidation,
    loginValidation,
};