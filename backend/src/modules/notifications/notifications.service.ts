import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notifRepo: Repository<Notification>,
  ) {}

  async findAllByUser(userId: number, limit = 50): Promise<Notification[]> {
    return this.notifRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getUnreadCount(userId: number): Promise<number> {
    return this.notifRepo.count({ where: { userId, isRead: false } });
  }

  async markAsRead(id: number, userId: number): Promise<void> {
    await this.notifRepo.update({ id, userId }, { isRead: true });
  }

  async markAllAsRead(userId: number): Promise<void> {
    await this.notifRepo.update({ userId }, { isRead: true });
  }
}
