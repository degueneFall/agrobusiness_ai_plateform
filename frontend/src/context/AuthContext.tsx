import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/auth.service';
import { usersService } from '../services/users.service';
import type { User, UserRole } from '../types';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (credentials: any) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
    isAuthenticated: boolean;
    hasRole: (...roles: (UserRole | string)[]) => boolean;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

function hasRole(user: User | null, ...roles: (UserRole | string)[]): boolean {
    if (!user?.role) return false;
    return roles.includes(user.role as UserRole);
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = authService.getCurrentUser();
        if (savedUser) {
            setUser(savedUser);
        }
        setLoading(false);
    }, []);

    const login = async (credentials: any) => {
        const response = await authService.login(credentials);
        setUser(response.user);
    };

    const register = async (data: any) => {
        const response = await authService.register(data);
        setUser(response.user);
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const refreshUser = async () => {
        try {
            const data = await usersService.getMe();
            const u = { id: data.id, email: data.email, firstName: data.firstName, lastName: data.lastName, role: data.role, profilePicture: data.profilePicture };
            localStorage.setItem('user', JSON.stringify(u));
            setUser(u);
        } catch {
            // 401 etc. : l'intercepteur api nettoie token/user et redirige vers /login
        }
    };

    const isAdmin = hasRole(user, 'admin', 'super_admin');

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout,
                refreshUser,
                isAuthenticated: !!user,
                hasRole: (...roles) => hasRole(user, ...roles),
                isAdmin,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
