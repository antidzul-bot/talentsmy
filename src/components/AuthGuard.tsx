import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from '../store';
import { UserRole } from '../types';

interface AuthGuardProps {
    children: React.ReactNode;
    allowedRoles?: UserRole[];
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children, allowedRoles }) => {
    const currentUser = useStore((state) => state.currentUser);
    const location = useLocation();

    if (!currentUser) {
        // Redirect to login but save the attempted url
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
        // Role not allowed
        if (currentUser.role === 'SUPPLIER') {
            return <Navigate to="/supplier" replace />;
        } else {
            return <Navigate to="/admin" replace />;
        }
    }

    return <>{children}</>;
};
