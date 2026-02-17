import { Controller, Get, Patch, Param, Query, UseGuards, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async findAll(@Query('limit') limit: string, @Request() req: { user: { userId: number } }) {
    const userId = req.user.userId;
    return this.notificationsService.findAllByUser(userId, limit ? parseInt(limit, 10) : 50);
  }

  @Get('unread-count')
  async getUnreadCount(@Request() req: { user: { userId: number } }) {
    return { count: await this.notificationsService.getUnreadCount(req.user.userId) };
  }

  @Patch('read-all')
  async markAllAsRead(@Request() req: { user: { userId: number } }) {
    await this.notificationsService.markAllAsRead(req.user.userId);
    return { ok: true };
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string, @Request() req: { user: { userId: number } }) {
    await this.notificationsService.markAsRead(Number(id), req.user.userId);
    return { ok: true };
  }
}
