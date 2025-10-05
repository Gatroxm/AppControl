import api from './api';

const recipeService = {
    // Get all published recipes (public)
    getRecipes: async (params = {}) => {
        const response = await api.get('/recipes', { params });
        return response.data;
    },

    // Get single recipe (public)
    getRecipe: async (id) => {
        const response = await api.get(`/recipes/${id}`);
        return response.data;
    },

    // Get popular tags (public)
    getPopularTags: async () => {
        const response = await api.get('/recipes/tags');
        return response.data;
    },

    // Get user's own recipes (Editor/Admin)
    getMyRecipes: async (params = {}) => {
        const response = await api.get('/recipes/my/list', { params });
        return response.data;
    },

    // Create recipe (Editor/Admin)
    createRecipe: async (formData) => {
        const response = await api.post('/recipes', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Update recipe (Editor/Admin)
    updateRecipe: async (id, formData) => {
        const response = await api.put(`/recipes/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Delete recipe (Editor/Admin)
    deleteRecipe: async (id) => {
        const response = await api.delete(`/recipes/${id}`);
        return response.data;
    },

    // Get recipe statistics (Editor/Admin)
    getStats: async () => {
        const response = await api.get('/recipes/my/stats');
        return response.data;
    },

    // Admin functions
    getAllRecipes: async (params = {}) => {
        const response = await api.get('/recipes/admin/all', { params });
        return response.data;
    },

    getAllStats: async () => {
        const response = await api.get('/recipes/admin/stats');
        return response.data;
    },
};

export default recipeService;