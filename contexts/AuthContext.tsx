
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (username: string, email: string) => void;
  updateProfile: (username: string, avatarId: number) => void;
  deleteAccount: () => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('pz_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (username: string, email: string) => {
    const newUser: User = { username, email, avatarId: 0 };
    setUser(newUser);
    localStorage.setItem('pz_user', JSON.stringify(newUser));
  };

  const updateProfile = (username: string, avatarId: number) => {
    if (user) {
      const updatedUser = { ...user, username, avatarId };
      setUser(updatedUser);
      localStorage.setItem('pz_user', JSON.stringify(updatedUser));
    }
  };

  const deleteAccount = () => {
    setUser(null);
    localStorage.removeItem('pz_user');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pz_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, updateProfile, deleteAccount, logout, isAuthenticated: !!user }}>
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
