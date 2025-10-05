const express = require('express');
const {
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
    notificationValidation
} = require('../controllers/userController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/errorHandler');

const router = express.Router();

// All routes require admin role
router.use(authenticateToken);
router.use(authorizeRole('admin'));

// @route   GET /api/users
// @desc    Get all users
// @access  Private (Admin only)
router.get('/', getAllUsers);

// @route   GET /api/users/stats
// @desc    Get user statistics
// @access  Private (Admin only)
router.get('/stats', getUserStats);

// @route   GET /api/users/export
// @desc    Export users to CSV
// @access  Private (Admin only)
router.get('/export', exportUsers);

// @route   GET /api/users/report/monthly
// @desc    Generate monthly report
// @access  Private (Admin only)
router.get('/report/monthly', generateMonthlyReport);

// @route   POST /api/users/notification
// @desc    Send notification to all users
// @access  Private (Admin only)
router.post('/notification', notificationValidation, handleValidationErrors, sendNotification);

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private (Admin only)
router.get('/:id', getUserById);

// @route   PUT /api/users/:id/role
// @desc    Update user role
// @access  Private (Admin only)
router.put('/:id/role', updateRoleValidation, handleValidationErrors, updateUserRole);

// @route   PUT /api/users/:id/deactivate
// @desc    Deactivate user
// @access  Private (Admin only)
router.put('/:id/deactivate', deactivateUser);

// @route   PUT /api/users/:id/reactivate
// @desc    Reactivate user
// @access  Private (Admin only)
router.put('/:id/reactivate', reactivateUser);

// @route   DELETE /api/users/:id
// @desc    Delete user permanently
// @access  Private (Admin only)
router.delete('/:id', deleteUser);

module.exports = router;