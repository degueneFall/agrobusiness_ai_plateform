import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seed, CropType, WaterRequirement } from './entities/seed.entity';

export interface SeedFilters {
  cropType?: CropType;
  waterRequirement?: WaterRequirement;
  optimalSoilType?: string;
  phMin?: number;
  phMax?: number;
  search?: string;
}

@Injectable()
export class SeedsService {
  constructor(
    @InjectRepository(Seed)
    private seedsRepo: Repository<Seed>,
  ) {}

  async findAll(filters?: SeedFilters): Promise<Seed[]> {
    const qb = this.seedsRepo
      .createQueryBuilder('s')
      .where('s.isActive = :active', { active: true })
      .orderBy('s.name', 'ASC');

    if (filters?.cropType) qb.andWhere('s.cropType = :cropType', { cropType: filters.cropType });
    if (filters?.waterRequirement) qb.andWhere('s.waterRequirement = :wr', { wr: filters.waterRequirement });
    if (filters?.optimalSoilType) qb.andWhere('s.optimalSoilType = :soil', { soil: filters.optimalSoilType });
    if (filters?.phMin != null) qb.andWhere('s.optimalPhMax >= :phMin', { phMin: filters.phMin });
    if (filters?.phMax != null) qb.andWhere('s.optimalPhMin <= :phMax', { phMax: filters.phMax });
    if (filters?.search?.trim()) {
      qb.andWhere('(s.name LIKE :search OR s.varietyCode LIKE :search)', {
        search: `%${filters.search.trim()}%`,
      });
    }
    return qb.getMany();
  }

  async findOne(id: number): Promise<Seed | null> {
    return this.seedsRepo.findOne({ where: { id, isActive: true } });
  }
}
