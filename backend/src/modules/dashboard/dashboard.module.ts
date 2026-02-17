import { Module, forwardRef } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { PlotsModule } from '../plots/plots.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiModel } from '../ai-admin/entities/ai-model.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    PlotsModule,
    NotificationsModule,
    TypeOrmModule.forFeature([AiModel]),
    forwardRef(() => AuthModule),
  ],
  providers: [DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule {}
