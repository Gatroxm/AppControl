import api from './api';

const examService = {
    // Upload medical exam
    uploadExam: async (formData) => {
        const response = await api.post('/records/exams', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Get user's medical exams
    getExams: async (params = {}) => {
        const response = await api.get('/records/exams', { params });
        return response.data;
    },

    // Get single medical exam
    getExam: async (id) => {
        const response = await api.get(`/records/exams/${id}`);
        return response.data;
    },

    // Download medical exam
    downloadExam: async (id) => {
        const response = await api.get(`/records/exams/${id}/download`, {
            responseType: 'blob',
        });
        return response;
    },

    // Update medical exam metadata
    updateExam: async (id, examData) => {
        const response = await api.put(`/records/exams/${id}`, examData);
        return response.data;
    },

    // Delete medical exam
    deleteExam: async (id) => {
        const response = await api.delete(`/records/exams/${id}`);
        return response.data;
    },

    // Get exam statistics
    getStats: async () => {
        const response = await api.get('/records/exams/stats');
        return response.data;
    },

    // Admin functions
    getAllExams: async (params = {}) => {
        const response = await api.get('/records/exams/admin/all', { params });
        return response.data;
    },

    getAllStats: async () => {
        const response = await api.get('/records/exams/admin/stats');
        return response.data;
    },
};

export default examService;