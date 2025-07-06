import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/AuthService';

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  currentUser: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());

  useEffect(() => {
    // 监听登录状态变化
    const checkAuthStatus = () => {
      const authStatus = authService.isAuthenticated();
      const user = authService.getCurrentUser();
      
      setIsAuthenticated(authStatus);
      setCurrentUser(user);
    };

    // 监听存储变化事件（跨标签页同步）
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'isAuthenticated' || e.key === 'username') {
        checkAuthStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // 定期检查状态（作为备用方案）
    const interval = setInterval(checkAuthStatus, 5000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const login = () => {
    setIsAuthenticated(true);
    setCurrentUser(authService.getCurrentUser());
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const value = {
    isAuthenticated,
    login,
    logout,
    currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 