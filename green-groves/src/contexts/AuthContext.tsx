import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  avatar?: string;
  created_at?: string;
  updated_at?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    // Check if user is logged in from localStorage
    const initAuth = async () => {
      const token = localStorage.getItem('auth_token');
      const savedUser = localStorage.getItem('greengroves_user');
      
      if (token && savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        } catch (error) {
          console.error('Error parsing saved user:', error);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('greengroves_user');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('Login attempt:', { email, password }); // Debug log
    setIsLoading(true);
    
    try {
      // Demo authentication ONLY - no API calls
      if (email.trim() === 'admin@greengroves.com' && password.trim() === 'admin123') {
        console.log('Demo auth successful'); // Debug log
        
        const demoUser: User = {
          id: '1',
          email: 'admin@greengroves.com',
          name: 'Admin User',
          role: 'admin',
          avatar: '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        setUser(demoUser);
        localStorage.setItem('auth_token', 'demo-token-123');
        localStorage.setItem('greengroves_user', JSON.stringify(demoUser));
        setIsLoading(false);
        return true;
      }
      
      console.log('Demo auth failed - invalid credentials'); // Debug log
      setIsLoading(false);
      return false;
      
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    setIsLoading(true);
    
    // Demo logout - no API calls
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('greengroves_user');
    setIsLoading(false);
  };

  const refreshUser = async () => {
    if (!isAuthenticated) return;
    
    // Demo mode - no refresh needed
    console.log('Demo mode - user refresh skipped');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isLoading, 
      isAuthenticated,
      refreshUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};