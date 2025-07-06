import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/AuthService';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    // 如果用户未登录，重定向到登录页面
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 