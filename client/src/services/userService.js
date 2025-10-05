import api from './api';

const userService = {
    // Update user profile
    updateProfile: async (profileData) => {
        const response = await api.put('/users/profile', profileData);
        return response.data;
    },

    // Get current user profile
    getProfile: async () => {
        const response = await api.get('/users/profile');
        return response.data;
    },

    // Get all users (Admin only)
    getAllUsers: async (params = {}) => {
        const response = await api.get('/users', { params });
        return response.data;
    },

    // Get users (Admin only) - alias for compatibility
    getUsers: async (params = {}) => {
        const response = await api.get('/users', { params });
        return response.data;
    },

    // Get user by ID (Admin only)
    getUser: async (id) => {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },

    // Update user (Admin only)
    updateUser: async (id, userData) => {
        const response = await api.put(`/users/${id}`, userData);
        return response.data;
    },

    // Delete user (Admin only)
    deleteUser: async (id) => {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    },

    // Update user role (Admin only)
    updateUserRole: async (id, role) => {
        const response = await api.put(`/users/${id}/role`, { role });
        return response.data;
    },

    // Deactivate user (Admin only)
    deactivateUser: async (id) => {
        const response = await api.put(`/users/${id}/deactivate`);
        return response.data;
    },

    // Reactivate user (Admin only)
    reactivateUser: async (id) => {
        const response = await api.put(`/users/${id}/reactivate`);
        return response.data;
    },

    // Get user statistics (Admin only)
    getStats: async () => {
        const response = await api.get('/users/stats');
        return response.data;
    },

    // Export users (Admin only)
    exportUsers: async () => {
        const response = await api.get('/users/export', {
            responseType: 'blob',
        });
        return response;
    },

    // Send notification to all users (Admin only)
    sendNotification: async (notificationData) => {
        const response = await api.post('/users/notification', notificationData);
        return response.data;
    },

    // Generate monthly report (Admin only)
    generateMonthlyReport: async (month, year) => {
        const response = await api.get('/users/report/monthly', {
            params: { month, year },
            responseType: 'blob',
        });
        return response;
    },
};

export default userService;