import { Module } from '@nestjs/common';
import { SystemAdminService } from './system-admin.service';
import { SystemAdminController } from './system-admin.controller';

@Module({
  providers: [SystemAdminService],
  controllers: [SystemAdminController]
})
export class SystemAdminModule {}
