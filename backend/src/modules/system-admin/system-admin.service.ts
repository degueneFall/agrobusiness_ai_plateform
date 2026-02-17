import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Region } from './entities/region.entity';

@Injectable()
export class SystemAdminService {
  constructor(
    @InjectRepository(Region)
    private regionRepo: Repository<Region>,
  ) {}

  async getRegions(): Promise<Region[]> {
    return this.regionRepo.find({ order: { name: 'ASC' } });
  }
}
