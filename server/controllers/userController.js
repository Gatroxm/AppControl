const User = require('../models/User');
const { body } = require('express-validator');

// Get all users (Admin only)
const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, role } = req.query;

        // Build query
        const query = { isActive: true };

        if (search) {
            query.$or = [
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

        if (role && ['admin', 'editor', 'user'].includes(role.toLowerCase())) {
            query.role = role.toLowerCase();
        }

        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await User.countDocuments(query);

        res.json({
            success: true,
            data: {
                users,
                pagination: {
                    current: page,
                    pages: Math.ceil(total / limit),
                    total,
                },
            },
        });
    } catch (error) {
        console.error('Error en getAllUsers:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
        });
    }
};

// Get user by ID (Admin only)
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado',
            });
        }

        res.json({
            success: true,
            data: { user },
        });
    } catch (error) {
        console.error('Error en getUserById:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
        });
    }
};

// Update user role (Admin only)
const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        // Validate role
        const validRoles = ['admin', 'editor', 'user'];
        const normalizedRole = role.toLowerCase();
        if (!validRoles.includes(normalizedRole)) {
            return res.status(400).json({
                success: false,
                message: 'Rol inválido. Debe ser admin, editor o user',
            });
        }

        // Find user
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado',
            });
        }

        // Don't allow changing own role unless there's another admin
        if (user._id.toString() === req.user._id.toString() && normalizedRole !== 'admin') {
            const adminCount = await User.countDocuments({ role: 'admin', isActive: true });
            if (adminCount <= 1) {
                return res.status(400).json({
                    success: false,
                    message: 'No puedes cambiar tu propio rol. Debe haber al menos un administrador.',
                });
            }
        }

        user.role = normalizedRole;
        await user.save();

        res.json({
            success: true,
            message: 'Rol de usuario actualizado exitosamente',
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                },
            },
        });
    } catch (error) {
        console.error('Error en updateUserRole:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
        });
    }
};

// Deactivate user (Admin only)
const deactivateUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Find user
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado',
            });
        }

        // Don't allow deactivating own account unless there's another admin
        if (user._id.toString() === req.user._id.toString()) {
            const adminCount = await User.countDocuments({
                role: 'admin',
                isActive: true,
                _id: { $ne: user._id }
            });

            if (adminCount < 1) {
                return res.status(400).json({
                    success: false,
                    message: 'No puedes desactivar tu propia cuenta. Debe haber al menos un administrador activo.',
                });
            }
        }

        user.isActive = false;
        await user.save();

        res.json({
            success: true,
            message: 'Usuario desactivado exitosamente',
        });
    } catch (error) {
        console.error('Error en deactivateUser:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
        });
    }
};

// Reactivate user (Admin only)
const reactivateUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado',
            });
        }

        user.isActive = true;
        await user.save();

        res.json({
            success: true,
            message: 'Usuario reactivado exitosamente',
        });
    } catch (error) {
        console.error('Error en reactivateUser:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
        });
    }
};

// Get user statistics (Admin only)
const getUserStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ isActive: true });
        const totalAdmins = await User.countDocuments({ role: 'admin', isActive: true });
        const totalEditors = await User.countDocuments({ role: 'editor', isActive: true });
        const totalRegularUsers = await User.countDocuments({ role: 'user', isActive: true });

        // Users registered in the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const newUsers = await User.countDocuments({
            createdAt: { $gte: thirtyDaysAgo },
            isActive: true
        });

        res.json({
            success: true,
            data: {
                stats: {
                    total: totalUsers,
                    admins: totalAdmins,
                    editors: totalEditors,
                    regularUsers: totalRegularUsers,
                    newUsersLast30Days: newUsers,
                },
            },
        });
    } catch (error) {
        console.error('Error en getUserStats:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
        });
    }
};

// Export users to CSV (Admin only)
const exportUsers = async (req, res) => {
    try {
        const users = await User.find({})
            .select('-password')
            .sort({ createdAt: -1 });

        // Create CSV content
        const headers = 'ID,Nombre,Email,Rol,Estado,Fecha de Registro\n';
        const csvContent = users.map(user =>
            `${user._id},${user.name},${user.email},${user.role},${user.isActive ? 'Activo' : 'Inactivo'},${user.createdAt.toISOString().split('T')[0]}`
        ).join('\n');

        const csv = headers + csvContent;

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="usuarios.csv"');
        res.send(csv);
    } catch (error) {
        console.error('Error en exportUsers:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Send notification to all users (Admin only)
const sendNotification = async (req, res) => {
    try {
        const { title, message } = req.body;

        if (!title || !message) {
            return res.status(400).json({
                success: false,
                message: 'Título y mensaje son requeridos'
            });
        }

        const activeUsers = await User.countDocuments({ isActive: true });

        // In a real implementation, you would send actual notifications
        // For now, we'll just simulate the notification sending
        console.log(`Enviando notificación "${title}" a ${activeUsers} usuarios activos`);
        console.log(`Mensaje: ${message}`);

        res.json({
            success: true,
            message: `Notificación enviada exitosamente a ${activeUsers} usuarios activos`,
            data: {
                sentTo: activeUsers,
                title,
                message
            }
        });
    } catch (error) {
        console.error('Error en sendNotification:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Generate monthly report (Admin only)
const generateMonthlyReport = async (req, res) => {
    try {
        const { month = new Date().getMonth() + 1, year = new Date().getFullYear() } = req.query;

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59);

        // Get statistics for the month
        const newUsers = await User.countDocuments({
            createdAt: { $gte: startDate, $lte: endDate }
        });

        const totalUsers = await User.countDocuments({ isActive: true });

        // Get user activity by role
        const usersByRole = await User.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: '$role', count: { $sum: 1 } } }
        ]);

        // Create report content
        const reportContent = `REPORTE MENSUAL - ${month}/${year}\n` +
            `=======================================\n\n` +
            `RESUMEN GENERAL:\n` +
            `- Usuarios totales activos: ${totalUsers}\n` +
            `- Nuevos usuarios en el mes: ${newUsers}\n\n` +
            `DISTRIBUCIÓN POR ROLES:\n` +
            usersByRole.map(role => `- ${role._id}: ${role.count}`).join('\n') + '\n\n' +
            `Reporte generado el: ${new Date().toLocaleString()}\n`;

        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Content-Disposition', `attachment; filename="reporte_${month}_${year}.txt"`);
        res.send(reportContent);
    } catch (error) {
        console.error('Error en generateMonthlyReport:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Delete user permanently (Admin only)
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        // Don't allow deleting yourself
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'No puedes eliminar tu propia cuenta'
            });
        }

        await User.findByIdAndDelete(id);

        res.json({
            success: true,
            message: 'Usuario eliminado permanentemente'
        });
    } catch (error) {
        console.error('Error en deleteUser:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Validation rules
const updateRoleValidation = [
    body('role')
        .isIn(['admin', 'editor', 'user'])
        .withMessage('El rol debe ser admin, editor o user'),
];

const notificationValidation = [
    body('title')
        .notEmpty()
        .withMessage('El título es requerido')
        .isLength({ max: 100 })
        .withMessage('El título no puede exceder 100 caracteres'),
    body('message')
        .notEmpty()
        .withMessage('El mensaje es requerido')
        .isLength({ max: 500 })
        .withMessage('El mensaje no puede exceder 500 caracteres'),
];

module.exports = {
    getAllUsers,
    getUserById,
    updateUserRole,
    deactivateUser,
    reactivateUser,
    deleteUser,
    getUserStats,
    exportUsers,
    sendNotification,
    generateMonthlyReport,
    updateRoleValidation,
    notificationValidation,
};