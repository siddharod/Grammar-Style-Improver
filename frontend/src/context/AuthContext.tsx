import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string, remember: boolean) => Promise<boolean>;
  demoLogin: () => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
  isInitializing: boolean;
  authError: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Synchronize authentication state on initial mount via /api/auth/me
  useEffect(() => {
    let isMounted = true;
    async function checkAuthSession() {
      try {
        const res = await api.getMe();
        if (isMounted && res.authenticated && res.user) {
          setUser(res.user);
        }
      } catch {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsInitializing(false);
        }
      }
    }
    checkAuthSession();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email: string, pass: string, _remember: boolean): Promise<boolean> => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await api.login(email, pass);
      setUser(res.user);
      return true;
    } catch (err: any) {
      setAuthError(err.message || 'Login failed. Please check your credentials.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, pass: string): Promise<boolean> => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await api.register(name, email, pass);
      setUser(res.user);
      return true;
    } catch (err: any) {
      setAuthError(err.message || 'Registration failed. Please check your inputs.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async () => {
    setLoading(true);
    setAuthError(null);
    const demoEmail = 'alex.morgan@university.edu';
    const demoPassword = 'Password123!';
    const demoName = 'Alex Morgan';

    try {
      // First attempt to log in
      try {
        const loginRes = await api.login(demoEmail, demoPassword);
        setUser(loginRes.user);
        return;
      } catch {
        // If demo user does not exist in SQLite database yet, create it!
        const regRes = await api.register(demoName, demoEmail, demoPassword);
        setUser(regRes.user);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Unable to log into demo account.');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.logout();
    } catch (err) {
      console.warn('Logout request warning:', err);
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        demoLogin,
        register,
        logout,
        loading,
        isInitializing,
        authError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
