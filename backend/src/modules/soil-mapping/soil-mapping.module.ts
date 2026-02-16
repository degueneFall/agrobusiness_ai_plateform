import { Module } from '@nestjs/common';
import { SoilMappingService } from './soil-mapping.service';
import { SoilMappingController } from './soil-mapping.controller';

@Module({
  providers: [SoilMappingService],
  controllers: [SoilMappingController]
})
export class SoilMappingModule {}
