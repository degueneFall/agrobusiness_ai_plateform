import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SoilMappingService } from './soil-mapping.service';
import { SoilMappingController } from './soil-mapping.controller';
import { DonneesSol } from './entities/donnees-sol.entity';
import { DonneesClimat } from './entities/donnees-climat.entity';
import { Sol } from './entities/sol.entity';
import { Climat } from './entities/climat.entity';
import { Carte } from './entities/carte.entity';
import { SoilAnalysis } from './entities/soil-analysis.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DonneesSol,
      DonneesClimat,
      Sol,
      Climat,
      Carte,
      SoilAnalysis,
    ]),
    AuthModule,
  ],
  providers: [SoilMappingService],
  controllers: [SoilMappingController],
  exports: [SoilMappingService],
})
export class SoilMappingModule { }
