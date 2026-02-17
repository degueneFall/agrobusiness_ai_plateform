import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedsService } from './seeds.service';
import { SeedsController } from './seeds.controller';
import { Seed } from './entities/seed.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Seed])],
  providers: [SeedsService],
  controllers: [SeedsController],
  exports: [SeedsService],
})
export class SeedsModule {}
