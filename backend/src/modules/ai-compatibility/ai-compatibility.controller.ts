import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { AiCompatibilityService } from './ai-compatibility.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('ai-compatibility')
@UseGuards(JwtAuthGuard)
export class AiCompatibilityController {
  constructor(private readonly aiCompatibilityService: AiCompatibilityService) {}

  @Get()
  async getRecommendations(@Query('plotId') plotId: string, @Request() req: { user: { userId: number } }) {
    const userId = req.user.userId;
    if (plotId) {
      return this.aiCompatibilityService.getRecommendationsByPlot(Number(plotId), userId);
    }
    return this.aiCompatibilityService.getRecommendationsByUser(userId);
  }

  @Get('compatibility')
  async getCompatibility(
    @Query('plotId') plotId: string,
    @Query('seedId') seedId: string,
    @Request() req: { user: { userId: number } },
  ) {
    if (!plotId || !seedId) throw new Error('plotId and seedId required');
    return this.aiCompatibilityService.getCompatibility(Number(plotId), Number(seedId), req.user.userId);
  }
}
