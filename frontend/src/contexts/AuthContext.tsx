import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'moderator';
  status: 'active' | 'banned';
  avatar?: string;
  avatar_public_id?: string;
  phone?: string;
  phone_country_code?: string;
  country?: string;
  address?: string;
  city?: string;
  zip_code?: string;
  bio?: string;
  is_banned?: boolean;
  first_login?: boolean;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize authentication on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        // Clear logout flag if we have a token
        localStorage.removeItem('user_logged_out');
        
        // Verify token by getting current user
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://103.252.93.249/api'}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data.user) {
            setUser(data.data.user);
            setIsAuthenticated(true);
          } else {
            // Invalid token, remove it
            localStorage.removeItem('auth_token');
          }
        } else {
          // Token invalid or expired
          localStorage.removeItem('auth_token');
        }
      }
    } catch (error) {
      localStorage.removeItem('auth_token');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://103.252.93.249/api'}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const { token, user: userData } = data.data;
        
        // Store token
        localStorage.setItem('auth_token', token);
        
        // Clear logout flag on successful login
        localStorage.removeItem('user_logged_out');
        
        // Set user state
        setUser(userData);
        setIsAuthenticated(true);
        
        return { success: true };
      } else {
        return { 
          success: false, 
          error: data.message || 'Login failed' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Network error. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (token) {
        // Call logout endpoint to revoke token
        await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://103.252.93.249/api'}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
      }
    } catch (error) {
    } finally {
      // Clear local state regardless of API call success
      localStorage.removeItem('auth_token');
      localStorage.removeItem('greengroves_user');
      localStorage.removeItem('user_logged_out'); // Clear logout flag
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        return false;
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://103.252.93.249/api'}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const { token: newToken, user: userData } = data.data;
          
          // Update token and user data
          localStorage.setItem('auth_token', newToken);
          setUser(userData);
          setIsAuthenticated(true);
          
          return true;
        }
      }
      
      return false;
    } catch (error) {
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
