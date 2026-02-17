import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlotsService } from '../plots/plots.service';
import { NotificationsService } from '../notifications/notifications.service';
import { AiModel } from '../ai-admin/entities/ai-model.entity';

@Injectable()
export class DashboardService {
  constructor(
    private readonly plotsService: PlotsService,
    private readonly notificationsService: NotificationsService,
    @InjectRepository(AiModel)
    private aiModelRepo: Repository<AiModel>,
  ) {}

  async getOverview(userId: number) {
    const [plotStats, notifications, unreadCount, aiModels] = await Promise.all([
      this.plotsService.getStats(userId),
      this.notificationsService.findAllByUser(userId, 10),
      this.notificationsService.getUnreadCount(userId),
      this.aiModelRepo.find({ where: { isActive: true }, select: ['id', 'name', 'version', 'accuracy'] }),
    ]);

    const totalModels = await this.aiModelRepo.count();
    const activeModels = aiModels.length;

    return {
      weather: {
        current: { temp: 28, humidity: 62, wind: 12, condition: 'Sunny', location: 'Dakar' },
        forecast: [
          { day: 'Lun', temp: 29, icon: 'sunny' },
          { day: 'Mar', temp: 27, icon: 'cloud' },
          { day: 'Mer', temp: 30, icon: 'sunny' },
        ],
      },
      soilHealth: {
        overallScore: plotStats.avgNdvi != null ? Math.round(plotStats.avgNdvi * 100) : 72,
        status: plotStats.avgNdvi != null && plotStats.avgNdvi >= 0.7 ? 'Bonne' : 'À surveiller',
        details: { ndvi: plotStats.avgNdvi, plotsWithData: plotStats.total },
      },
      metrics: {
        totalPlots: plotStats.total,
        activeAlerts: unreadCount,
        pendingTasks: 0,
        aiRecommendations: 0,
      },
      rainfallMm: 42,
      rainfallTrend: -12,
      recentActivities: notifications.map((n) => ({
        id: n.id,
        type: n.type,
        title: n.title,
        message: n.message,
        time: n.createdAt,
        isRead: n.isRead,
      })),
      aiModels: aiModels.map((m) => ({
        name: `${m.name} ${m.version}`,
        status: 'active',
        accuracy: m.accuracy != null ? Number(m.accuracy) : null,
      })),
      aiModelsActiveCount: `${activeModels}/${totalModels}`,
    };
  }
}
