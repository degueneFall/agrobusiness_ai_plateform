export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
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
