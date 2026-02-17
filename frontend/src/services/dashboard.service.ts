import api from './api';

export interface DashboardOverview {
  weather: { current: any; forecast: any[] };
  soilHealth: { overallScore: number; status: string; details: any };
  metrics: { totalPlots: number; activeAlerts: number; pendingTasks: number; aiRecommendations: number };
  rainfallMm?: number;
  rainfallTrend?: number;
  recentActivities: Array<{ id: number; type: string; title: string; message: string; time: string; isRead?: boolean }>;
  aiModels: Array<{ name: string; status: string; accuracy: number | null }>;
  aiModelsActiveCount?: string;
}

export const dashboardService = {
  getOverview: async (): Promise<DashboardOverview> => {
    const res = await api.get<DashboardOverview>('/dashboard/overview');
    return res.data;
  },
};
