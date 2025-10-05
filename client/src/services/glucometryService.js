import api from './api';

const glucometryService = {
    // Create glucometry record
    createRecord: async (recordData) => {
        const response = await api.post('/records/glucometry', recordData);
        return response.data;
    },

    // Get user's glucometry records
    getRecords: async (params = {}) => {
        const response = await api.get('/records/glucometry', { params });
        return response.data;
    },

    // Get single glucometry record
    getRecord: async (id) => {
        const response = await api.get(`/records/glucometry/${id}`);
        return response.data;
    },

    // Update glucometry record
    updateRecord: async (id, recordData) => {
        const response = await api.put(`/records/glucometry/${id}`, recordData);
        return response.data;
    },

    // Delete glucometry record
    deleteRecord: async (id) => {
        const response = await api.delete(`/records/glucometry/${id}`);
        return response.data;
    },

    // Get glucometry statistics
    getStats: async (period = 30) => {
        const response = await api.get('/records/glucometry/stats', {
            params: { period },
        });
        return response.data;
    },

    // Admin functions
    getAllRecords: async (params = {}) => {
        const response = await api.get('/records/glucometry/admin/all', { params });
        return response.data;
    },

    getAllStats: async (period = 30) => {
        const response = await api.get('/records/glucometry/admin/stats', {
            params: { period },
        });
        return response.data;
    },
};

export default glucometryService;