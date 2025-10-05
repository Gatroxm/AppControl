import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                if (authService.isAuthenticated()) {
                    const storedUser = authService.getCurrentUser();
                    if (storedUser) {
                        setUser(storedUser);
                        setIsAuthenticated(true);

                        // Verify token is still valid
                        try {
                            const response = await authService.getMe();
                            if (response.success) {
                                setUser(response.data.user);
                            } else {
                                console.warn('Token verification failed - logging out');
                                logout();
                            }
                        } catch (error) {
                            console.warn('Token verification failed:', error.message);
                            // Clear invalid tokens
                            authService.logout();
                            setUser(null);
                            setIsAuthenticated(false);
                        }
                    }
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
                logout();
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = async (credentials) => {
        try {
            console.log('AuthContext login called with:', { email: credentials.email, password: '***' });
            const response = await authService.login(credentials);
            console.log('AuthService response:', response);

            if (response.success) {
                setUser(response.data.user);
                setIsAuthenticated(true);
                return response;
            }
            return response;
        } catch (error) {
            console.error('Login error in AuthContext:', error);
            console.error('Error response:', error.response?.data);
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const response = await authService.register(userData);
            if (response.success) {
                setUser(response.data.user);
                setIsAuthenticated(true);
                return response;
            }
            return response;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
    };

    const updateProfile = async (profileData) => {
        try {
            const response = await authService.updateProfile(profileData);
            if (response.success) {
                setUser(response.data.user);
                return response;
            }
            return response;
        } catch (error) {
            throw error;
        }
    };

    const hasRole = (role) => {
        return user && user.role === role;
    };

    const hasAnyRole = (roles) => {
        return user && roles.includes(user.role);
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        updateProfile,
        hasRole,
        hasAnyRole,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;