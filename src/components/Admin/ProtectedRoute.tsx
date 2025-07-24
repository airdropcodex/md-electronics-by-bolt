import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useClerkAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = ['admin', 'staff'],
  redirectTo = '/admin/login'
}) => {
  const { user, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-westar">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-clay-creek"></div>
      </div>
    );
  }

  if (!user || !userProfile) {
    return <Navigate to={redirectTo} replace />;
  }

  if (!allowedRoles.includes(userProfile.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};