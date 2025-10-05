import { useState, useCallback } from 'react';

export const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const execute = useCallback(async (apiFunction, ...args) => {
        try {
            setLoading(true);
            setError(null);
            const result = await apiFunction(...args);
            return result;
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Ha ocurrido un error';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        loading,
        error,
        execute,
        clearError,
    };
};