import { Module } from '@nestjs/common';
import { AiAdminService } from './ai-admin.service';
import { AiAdminController } from './ai-admin.controller';

@Module({
  providers: [AiAdminService],
  controllers: [AiAdminController]
})
export class AiAdminModule {}
