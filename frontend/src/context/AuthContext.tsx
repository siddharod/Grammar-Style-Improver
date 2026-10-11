import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import { DEMO_USER } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string, remember: boolean) => Promise<boolean>;
  demoLogin: () => void;
  register: (name: string, email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('saas_grammar_user');
    return saved ? JSON.parse(saved) : DEMO_USER; // Default to demo user for viva ease, can logout anytime
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('saas_grammar_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('saas_grammar_user');
    }
  }, [user]);

  const login = async (email: string, _pass: string, _remember: boolean): Promise<boolean> => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600)); // UI polish simulation
    const loggedUser: User = {
      ...DEMO_USER,
      email: email || DEMO_USER.email,
      name: email.split('@')[0] || DEMO_USER.name,
    };
    setUser(loggedUser);
    setLoading(false);
    return true;
  };

  const demoLogin = () => {
    setUser(DEMO_USER);
  };

  const register = async (name: string, email: string, _pass: string): Promise<boolean> => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name,
      email,
      role: 'Student / Researcher',
      joinedDate: 'Oct 2026',
      analysesCount: 0,
    };
    setUser(newUser);
    setLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
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
