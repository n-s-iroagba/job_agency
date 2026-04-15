'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import api from '@/lib/api';
import { CONSTANTS } from '@/constants';

interface User {
    id: number;
    email: string;
    role: string;
    fullName: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (accessToken: string, user: User) => void;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PUBLIC_ROUTES = [
    CONSTANTS.ROUTES.LOGIN,
    CONSTANTS.ROUTES.REGISTER,
    CONSTANTS.ROUTES.FORGOT_PASSWORD,
    CONSTANTS.ROUTES.RESET_PASSWORD,
    '/verify-email',
    '/'
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    const refreshUser = async () => {
        try {
            const { data } = await api.get('/auth/me');
            setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
        } catch (error) {
            setUser(null);
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        if (token) {
            refreshUser();
        } else {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!isLoading) {
            const isPublicRoute = PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith('/register/'));
            if (!user && !isPublicRoute) {
                router.push(CONSTANTS.ROUTES.LOGIN);
            }
        }
    }, [user, isLoading, pathname, router]);

    const login = (accessToken: string, user: User) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            setUser(null);
            router.push(CONSTANTS.ROUTES.LOGIN);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, refreshUser }}>
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
