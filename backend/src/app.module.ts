import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { SeedsModule } from './modules/seeds/seeds.module';
import { SoilMappingModule } from './modules/soil-mapping/soil-mapping.module';
import { AiCompatibilityModule } from './modules/ai-compatibility/ai-compatibility.module';
import { ReportsModule } from './modules/reports/reports.module';
import { PlotsModule } from './modules/plots/plots.module';
import { AiAdminModule } from './modules/ai-admin/ai-admin.module';
import { SystemAdminModule } from './modules/system-admin/system-admin.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get<string>('DB_USER', 'root'),
        password: configService.get<string>('DB_PASSWORD', ''),
        database: configService.get<string>('DB_NAME', 'agribusiness_ai_db'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // Only for development
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    DashboardModule,
    SeedsModule,
    SoilMappingModule,
    AiCompatibilityModule,
    ReportsModule,
    PlotsModule,
    AiAdminModule,
    SystemAdminModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
