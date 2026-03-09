import React, { createContext, useContext, useState, useCallback } from 'react';
import type { AuthResponse } from '../types';

interface AuthUser {
    token: string;
    email: string;
    name: string;
}

interface AuthContextType {
    user: AuthUser | null;
    isAuthenticated: boolean;
    signIn: (data: AuthResponse) => void;
    signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const loadUser = (): AuthUser | null => {
    try {
        const raw = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (raw && token) return JSON.parse(raw);
    } catch { }
    return null;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(loadUser);

    const signIn = useCallback((data: AuthResponse) => {
        const u: AuthUser = { token: data.token, email: data.email, name: data.name };
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(u));
        setUser(u);
    }, []);

    const signOut = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
