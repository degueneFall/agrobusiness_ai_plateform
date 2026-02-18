import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plot, SoilType, PlotStatus } from './entities/plot.entity';

@Injectable()
export class PlotsService {
  constructor(
    @InjectRepository(Plot)
    private plotsRepo: Repository<Plot>,
  ) { }

  async findAllByUser(userId: number): Promise<Plot[]> {
    const plots = await this.plotsRepo.find({
      where: { userId },
      order: { id: 'ASC' },
      relations: ['zone', 'zone.region'],
    });
    // Map zone.region to region property for frontend compatibility if needed, 
    // or frontend needs update. For now, let's keep it simple.
    // However, Plot entity no longer has 'region' property.
    // We can add it dynamically or rely on frontend to use plot.zone.region.
    return plots.map(plot => ({
      ...plot,
      region: plot.zone?.region,
      // mapping id_zone to regionId just in case
      regionId: plot.zone?.idRegion
    })) as any;
  }

  async findOne(id: number, userId: number): Promise<Plot | null> {
    const plot = await this.plotsRepo.findOne({ where: { id, userId }, relations: ['zone', 'zone.region'] });
    if (plot) {
      (plot as any).region = plot.zone?.region;
    }
    return plot;
  }

  async create(userId: number, data: Partial<Plot>): Promise<Plot> {
    const plot = this.plotsRepo.create({ ...data, userId });
    return this.plotsRepo.save(plot);
  }

  async update(id: number, userId: number, data: Partial<Plot>): Promise<Plot> {
    await this.plotsRepo.update({ id, userId }, data as any);
    const updated = await this.findOne(id, userId);
    if (!updated) throw new Error('Plot not found');
    return updated;
  }

  async getStats(userId: number): Promise<{ total: number; avgNdvi: number | null; withLowHumidity: number }> {
    const plots = await this.findAllByUser(userId);
    const total = plots.length;
    // ndviScore removed from entity as it is missing in DB schema. Mocking it for now.
    const withNdvi = plots.filter((p) => (p as any).ndviScore != null);
    const avgNdvi = withNdvi.length
      ? withNdvi.reduce((s, p) => s + Number((p as any).ndviScore), 0) / withNdvi.length
      : null;
    return { total, avgNdvi: avgNdvi != null ? Math.round(avgNdvi * 100) / 100 : null, withLowHumidity: 0 };
  }
}
