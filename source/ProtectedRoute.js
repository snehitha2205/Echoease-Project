import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user) {
        // Redirect to the login page if no token or user
        return <Navigate to="/" replace />;
    }

    if (role && user.role !== role) {
        // Redirect to the login page if the role does not match
        return <Navigate to="/" replace />;
    }

    // Allow access if authenticated and role matches
    return children;
};

export default ProtectedRoute;
