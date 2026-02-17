import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plot, SoilType, PlotStatus } from './entities/plot.entity';

@Injectable()
export class PlotsService {
  constructor(
    @InjectRepository(Plot)
    private plotsRepo: Repository<Plot>,
  ) {}

  async findAllByUser(userId: number): Promise<Plot[]> {
    return this.plotsRepo.find({
      where: { userId },
      order: { id: 'ASC' },
      relations: ['region'],
    });
  }

  async findOne(id: number, userId: number): Promise<Plot | null> {
    return this.plotsRepo.findOne({ where: { id, userId }, relations: ['region'] });
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
    const withNdvi = plots.filter((p) => p.ndviScore != null);
    const avgNdvi = withNdvi.length
      ? withNdvi.reduce((s, p) => s + Number(p.ndviScore), 0) / withNdvi.length
      : null;
    return { total, avgNdvi: avgNdvi != null ? Math.round(avgNdvi * 100) / 100 : null, withLowHumidity: 0 };
  }
}
