import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemAdminService } from './system-admin.service';
import { SystemAdminController } from './system-admin.controller';
import { Region } from './entities/region.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Region]), AuthModule],
  providers: [SystemAdminService],
  controllers: [SystemAdminController],
  exports: [SystemAdminService],
})
export class SystemAdminModule {}
