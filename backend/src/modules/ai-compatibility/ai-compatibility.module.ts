import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiCompatibilityService } from './ai-compatibility.service';
import { AiCompatibilityController } from './ai-compatibility.controller';
import { AiRecommendation } from './entities/ai-recommendation.entity';
import { Plot } from '../plots/entities/plot.entity';
import { Seed } from '../seeds/entities/seed.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AiRecommendation, Plot, Seed]),
    forwardRef(() => AuthModule),
  ],
  providers: [AiCompatibilityService],
  controllers: [AiCompatibilityController],
  exports: [AiCompatibilityService],
})
export class AiCompatibilityModule {}
