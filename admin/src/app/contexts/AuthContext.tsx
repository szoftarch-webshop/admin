'use client';

import React, { createContext, useState, ReactNode, useContext } from 'react';
import User from '../dtos/user';

interface AuthContextType {
    user: User | {};
    isAuthenticated: boolean;
    login: (email: string, password: string, rememberMe: boolean) => Promise<Response>;
    logout: () => Promise<void>;
    checkAuthorization: () => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | {}>({});
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const login = async (email: string, password: string, rememberMe: boolean) => {
        const loginApi = "https://localhost:44315";
        const cookiesUrl = rememberMe ? "/login?useCookies=true" : "/login?useSessionCookies=true";

        const response = await fetch(loginApi + cookiesUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include',
        });

        if (response.ok) {
            setIsAuthenticated(true);
            setUser({ email: email });
        } else {
            setIsAuthenticated(false);
            setUser({});
        }

        return response;
    };

    const logout = async () => {
        const logoutApi = "https://localhost:44315/logout";
  
        await fetch(logoutApi, {
          method: 'POST',
          credentials: 'include',
        });

        setIsAuthenticated(false);
        setUser({});
    };

    const checkAuthorization = async () => {
        const response = await fetch('https://localhost:44315/pingauth', {
            method: 'GET',
            credentials: 'include',
        });

        if (response.ok) {
            setIsAuthenticated(true);
            const data = await response.json();
            setUser({ email: data.email });
        } else {
            setIsAuthenticated(false);
            setUser({});
        }

        return response;
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout, checkAuthorization }}>
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
