import { Module } from '@nestjs/common';
import { AiCompatibilityService } from './ai-compatibility.service';
import { AiCompatibilityController } from './ai-compatibility.controller';

@Module({
  providers: [AiCompatibilityService],
  controllers: [AiCompatibilityController]
})
export class AiCompatibilityModule {}
