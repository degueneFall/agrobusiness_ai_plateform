import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemAdminService } from './system-admin.service';
import { SystemAdminController } from './system-admin.controller';
import { Region } from './entities/region.entity';
import { Zone } from './entities/zone.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Region, Zone]), AuthModule],
  providers: [SystemAdminService],
  controllers: [SystemAdminController],
  exports: [SystemAdminService],
})
export class SystemAdminModule { }

