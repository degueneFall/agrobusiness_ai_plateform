import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { AiRecommendation } from './entities/ai-recommendation.entity';
import { Plot } from '../plots/entities/plot.entity';
import { Seed } from '../seeds/entities/seed.entity';

@Injectable()
export class AiCompatibilityService {
  constructor(
    @InjectRepository(AiRecommendation)
    private recRepo: Repository<AiRecommendation>,
    @InjectRepository(Plot)
    private plotRepo: Repository<Plot>,
    @InjectRepository(Seed)
    private seedRepo: Repository<Seed>,
  ) { }

  async getRecommendationsByPlot(plotId: number, userId: number): Promise<AiRecommendation[]> {
    const plot = await this.plotRepo.findOne({ where: { id: plotId, userId } });
    if (!plot) return [];
    return this.recRepo.find({
      where: { plotId },
      relations: ['seed'],
      order: { compatibilityScore: 'DESC' },
    });
  }

  async getRecommendationsByUser(userId: number): Promise<AiRecommendation[]> {
    const plotIds = await this.plotRepo.find({ where: { userId }, select: ['id'] }).then((p) => p.map((x) => x.id));
    if (plotIds.length === 0) return [];
    return this.recRepo.find({
      where: { plotId: In(plotIds) },
      relations: ['seed', 'plot'],
      order: { compatibilityScore: 'DESC' },
      take: 50,
    });
  }

  /** Compute compatibility score for a plot+seed (simplified) and optionally save recommendation */
  async getCompatibility(plotId: number, seedId: number, userId: number): Promise<{
    compatibilityScore: number;
    confidenceLevel: number;
    expectedYield: number | null;
    reasoning: string[];
  }> {
    const plot = await this.plotRepo.findOne({ where: { id: plotId, userId } });
    const seed = await this.seedRepo.findOne({ where: { id: seedId } });
    if (!plot || !seed) {
      throw new Error('Plot or seed not found');
    }
    const reasoning: string[] = [];
    let score = 80;
    // Properties removed from DB schema: soilPh, ndviScore. Using defaults for now.
    const plotPh = 6.5; // (plot as any).soilPh != null ? Number((plot as any).soilPh) : 6.5;
    const phMin = seed.optimalPhMin != null ? Number(seed.optimalPhMin) : 6;
    const phMax = seed.optimalPhMax != null ? Number(seed.optimalPhMax) : 7.5;
    if (plotPh >= phMin && plotPh <= phMax) {
      score += 10;
      reasoning.push('pH du sol dans la plage optimale (Simulé)');
    } else {
      reasoning.push('pH du sol hors plage optimale (Simulé)');
    }
    // if (plot.ndviScore != null && Number(plot.ndviScore) >= 0.6) {
    //   score += 5;
    //   reasoning.push('NDVI favorable');
    // }
    const expectedYield = seed.yieldPotential != null ? Number(seed.yieldPotential) : null;
    return {
      compatibilityScore: Math.min(99, score),
      confidenceLevel: 0.85,
      expectedYield,
      reasoning,
    };
  }
}
