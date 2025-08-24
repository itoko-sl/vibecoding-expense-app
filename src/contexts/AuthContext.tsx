'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, LoginCredentials } from '@/types/user';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  switchUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// サンプルユーザーデータ
const sampleUsers: User[] = [
  {
    id: '1',
    name: '田中 太郎',
    email: 'tanaka@company.com',
    role: '社員',
    department: '営業部',
    createdAt: '2025-01-01T00:00:00Z',
    lastLoginAt: '2025-08-22T09:00:00Z'
  },
  {
    id: '2',
    name: '佐藤 花子',
    email: 'sato@company.com',
    role: '承認者',
    department: '営業部',
    createdAt: '2025-01-01T00:00:00Z',
    lastLoginAt: '2025-08-22T08:30:00Z'
  },
  {
    id: '3',
    name: '山田 管理',
    email: 'admin@company.com',
    role: 'Admin',
    department: '管理部',
    createdAt: '2025-01-01T00:00:00Z',
    lastLoginAt: '2025-08-22T08:00:00Z'
  }
];

// 簡単なパスワード（実際のアプリでは暗号化が必要）
const userPasswords: Record<string, string> = {
  'tanaka@company.com': 'password123',
  'sato@company.com': 'password123',
  'admin@company.com': 'admin123'
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  console.log('🔐 [DEBUG] AuthContext state:', authState);

  useEffect(() => {
    // クライアントサイドでのみローカルストレージから復元
    const restoreAuth = () => {
      try {
        if (typeof window !== 'undefined') {
          const savedUserId = localStorage.getItem('currentUserId');
          if (savedUserId) {
            const user = sampleUsers.find(u => u.id === savedUserId);
            if (user) {
              setAuthState({
                user,
                isAuthenticated: true,
                isLoading: false
              });
              return;
            }
          }
        }
      } catch (error) {
        console.warn('localStorage access failed:', error);
      }
      
      setAuthState(prev => ({ ...prev, isLoading: false }));
    };

    restoreAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      // 簡単な認証（実際のアプリではAPIを呼び出し）
      await new Promise(resolve => setTimeout(resolve, 1000)); // ローディング演出
      
      const user = sampleUsers.find(u => u.email === credentials.email);
      const isValidPassword = userPasswords[credentials.email] === credentials.password;
      
      if (user && isValidPassword) {
        const updatedUser = { ...user, lastLoginAt: new Date().toISOString() };
        
        try {
          if (typeof window !== 'undefined') {
            localStorage.setItem('currentUserId', user.id);
          }
        } catch (error) {
          console.warn('localStorage save failed:', error);
        }
        
        setAuthState({
          user: updatedUser,
          isAuthenticated: true,
          isLoading: false
        });
        return true;
      }
      
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  const logout = () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('currentUserId');
      }
    } catch (error) {
      console.warn('localStorage clear failed:', error);
    }
    
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
  };

  const switchUser = (userId: string) => {
    const user = sampleUsers.find(u => u.id === userId);
    if (user) {
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('currentUserId', user.id);
        }
      } catch (error) {
        console.warn('localStorage save failed:', error);
      }
      
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false
      });
    }
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      logout,
      switchUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
