const { verifyToken } = require('../config/jwt');
const User = require('../models/User');

const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token de acceso requerido',
            });
        }

        const decoded = verifyToken(token);
        const user = await User.findById(decoded.userId).select('-password');

        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Token inválido o usuario inactivo',
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Error en authenticateToken:', error.message);

        // More specific error messages
        let message = 'Token inválido';
        if (error.name === 'TokenExpiredError') {
            message = 'Token expirado';
        } else if (error.name === 'JsonWebTokenError') {
            message = 'Token malformado';
        }

        return res.status(401).json({
            success: false,
            message,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

const authorizeRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no autenticado',
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para acceder a este recurso',
            });
        }

        next();
    };
};

const checkResourceOwnership = (req, res, next) => {
    const { userId } = req.params;

    if (req.user.role === 'admin' || req.user._id.toString() === userId) {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: 'No tienes permisos para acceder a este recurso',
        });
    }
};

module.exports = {
    authenticateToken,
    authorizeRole,
    checkResourceOwnership,
};