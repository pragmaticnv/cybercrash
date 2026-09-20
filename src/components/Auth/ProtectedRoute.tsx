import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { UserRole } from '../../types/auth';
import { AccessDenied } from '../../pages/AccessDenied';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  children: React.ReactElement;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { user, isAuthenticated } = useAuthStore();
  const location = useLocation();

  // If user is not authenticated at all, redirect to login gateway
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Admin has global operational clearance across all subsystems
  if (user.role === 'ADMIN') {
    return children;
  }

  // If authenticated but role does not match required permissions
  if (!allowedRoles.includes(user.role)) {
    return <AccessDenied requiredRoles={allowedRoles} />;
  }

  // Authorized: render the subsystem interface
  return children;
};
