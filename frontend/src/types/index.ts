export const USER_ROLES = ['farmer', 'agronomist', 'admin', 'super_admin'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  farmer: 'Agriculteur',
  agronomist: 'Agronome',
  admin: 'Administrateur',
  super_admin: 'Super administrateur',
};

export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole | string;
    profilePicture?: string;
}

export interface AuthResponse {
    access_token: string;
    user: User;
}

export interface WeatherData {
    current: {
        temp: number;
        humidity: number;
        wind: number;
        condition: string;
        location: string;
    };
    forecast: Array<{
        day: string;
        temp: number;
        icon: string;
    }>;
}

export interface DashboardMetrics {
    totalPlots: number;
    activeAlerts: number;
    pendingTasks: number;
    aiRecommendations: number;
}
