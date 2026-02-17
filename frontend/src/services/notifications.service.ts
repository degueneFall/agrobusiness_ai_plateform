import api from './api';

export interface Notification {
  id: number;
  userId: number;
  type?: string;
  title: string;
  message?: string;
  priority?: string;
  isRead: boolean;
  relatedEntityType?: string;
  relatedEntityId?: number;
  createdAt: string;
}

export const notificationsService = {
  getAll: async (limit?: number): Promise<Notification[]> => {
    const res = await api.get<Notification[]>('/notifications', limit ? { params: { limit } } : undefined);
    return res.data;
  },
  getUnreadCount: async (): Promise<number> => {
    const res = await api.get<{ count: number }>('/notifications/unread-count');
    return res.data.count;
  },
  markAsRead: async (id: number): Promise<void> => {
    await api.patch(`/notifications/${id}/read`);
  },
  markAllAsRead: async (): Promise<void> => {
    await api.patch('/notifications/read-all');
  },
};
