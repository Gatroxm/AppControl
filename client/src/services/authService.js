import api from './api';

const authService = {
    // Register new user
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        if (response.data.success) {
            localStorage.setItem('token', response.data.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
        }
        return response.data;
    },

    // Login user
    login: async (credentials) => {
        console.log('authService.login called with:', {
            email: credentials.email,
            password: credentials.password ? '***' : 'undefined',
            hasEmail: !!credentials.email,
            hasPassword: !!credentials.password
        });

        try {
            const response = await api.post('/auth/login', credentials);
            console.log('authService API response received:', response.data);

            if (response.data.success) {
                localStorage.setItem('token', response.data.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.data.user));
            }
            return response.data;
        } catch (error) {
            console.error('authService.login error:', error);
            console.error('Error details:', error.response?.data);
            throw error;
        }
    },

    // Logout user
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // Get current user
    getMe: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    // Update profile
    updateProfile: async (profileData) => {
        const response = await api.put('/auth/profile', profileData);
        if (response.data.success) {
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
        }
        return response.data;
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    // Get stored user
    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Get stored token
    getToken: () => {
        return localStorage.getItem('token');
    },
};

export default authService;