import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardService {

    async getOverview() {
        return {
            weather: {
                current: { temp: 28, humidity: 62, wind: 12, condition: 'Sunny', location: 'Dakar' },
                forecast: [
                    { day: 'Lun', temp: 29, icon: 'sunny' },
                    { day: 'Mar', temp: 27, icon: 'cloud' },
                    { day: 'Mer', temp: 30, icon: 'sunny' },
                ]
            },
            soilHealth: {
                overallScore: 85,
                status: 'Bonne',
                details: { ph: 6.8, nitrogen: 'Optimal', moisture: 'Adequate' }
            },
            metrics: {
                totalPlots: 12,
                activeAlerts: 3,
                pendingTasks: 5,
                aiRecommendations: 8
            },
            recentActivities: [
                { id: 1, type: 'alert', message: 'Niveau d\'humidité bas détecté - Parcelle A2', time: '2h ago' },
                { id: 2, type: 'info', message: 'Nouvelle recommandation de semis disponible', time: '5h ago' },
                { id: 3, type: 'success', message: 'Analyse de sol complétée - Parcelle B1', time: '1d ago' },
            ],
            aiModels: [
                { name: 'Seed Rec Sys v2.4', status: 'active', accuracy: 94.5 },
                { name: 'Yield Pred v1.1', status: 'training', accuracy: 88.2 }
            ]
        };
    }
}
