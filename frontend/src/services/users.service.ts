import api from './api';
import type { User, UserRole } from '../types';

export interface UpdateProfileData {
    firstName?: string;
    lastName?: string;
    phone?: string;
}

export const usersService = {
    getMe: async (): Promise<User & { phone?: string }> => {
        const response = await api.get<User & { phone?: string }>('/users/me');
        return response.data;
    },

    updateProfile: async (data: UpdateProfileData): Promise<User & { phone?: string }> => {
        const response = await api.patch<User & { phone?: string }>('/users/me', data);
        return response.data;
    },

    getAll: async (): Promise<User[]> => {
        const response = await api.get<User[]>('/users');
        return response.data;
    },

    updateRole: async (userId: number, role: UserRole): Promise<User> => {
        const response = await api.patch<User>(`/users/${userId}/role`, { role });
        return response.data;
    },

    /** Créer un utilisateur (réservé admin/super_admin). */
    createByAdmin: async (data: { email: string; password: string; firstName?: string; lastName?: string; role: UserRole }): Promise<User> => {
        const response = await api.post<User>('/users', data);
        return response.data;
    },
};
