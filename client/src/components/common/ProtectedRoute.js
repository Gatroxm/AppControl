import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
    const { isAuthenticated, user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!isAuthenticated) {
        // Redirect to login page with return url
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check if user has required role
    if (requiredRoles.length > 0 && !requiredRoles.includes(user?.role)) {
        // Redirect to dashboard if user doesn't have required role
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;