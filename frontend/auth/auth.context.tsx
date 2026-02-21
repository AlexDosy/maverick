'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';

type Role = 'ADMIN' | 'INSTRUCTOR' | 'STUDENT';

interface JwtPayload {
  sub: string;
  role: Role;
  exp: number;
}

interface AuthContextType {
  userId: string | null;
  role: Role | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('token');
    if (!stored) return;

    const decoded = jwtDecode<JwtPayload>(stored);
    setToken(stored);
    setRole(decoded.role);
    setUserId(decoded.sub);
  }, []);

  async function login(email: string, password: string) {
    const res = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error('Login failed');

    const { access_token } = await res.json();
    const decoded = jwtDecode<JwtPayload>(access_token);

    localStorage.setItem('token', access_token);
    setToken(access_token);
    setRole(decoded.role);
    setUserId(decoded.sub);
  }

  function logout() {
    localStorage.removeItem('token');
    setToken(null);
    setRole(null);
    setUserId(null);
  }

  return (
    <AuthContext.Provider
      value={{
        userId,
        role,
        token,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
