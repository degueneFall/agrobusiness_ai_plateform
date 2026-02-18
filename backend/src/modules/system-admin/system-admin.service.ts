import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Region } from './entities/region.entity';
import { Zone } from './entities/zone.entity';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';

@Injectable()
export class SystemAdminService {
  constructor(
    @InjectRepository(Region)
    private regionRepo: Repository<Region>,
    @InjectRepository(Zone)
    private zoneRepo: Repository<Zone>,
  ) { }

  async getRegions(): Promise<Region[]> {
    return this.regionRepo.find({ order: { name: 'ASC' } });
  }

  // Zones CRUD
  async getAllZones(): Promise<Zone[]> {
    return this.zoneRepo.find({
      relations: ['region'],
      order: { nomZone: 'ASC' }
    });
  }

  async getZoneById(id: number): Promise<Zone> {
    const zone = await this.zoneRepo.findOne({
      where: { id },
      relations: ['region']
    });

    if (!zone) {
      throw new NotFoundException(`Zone with ID ${id} not found`);
    }

    return zone;
  }

  async getZonesByRegion(regionId: number): Promise<Zone[]> {
    return this.zoneRepo.find({
      where: { idRegion: regionId },
      relations: ['region'],
      order: { nomZone: 'ASC' }
    });
  }

  async createZone(createZoneDto: CreateZoneDto): Promise<Zone> {
    const zone = this.zoneRepo.create(createZoneDto);
    return this.zoneRepo.save(zone);
  }

  async updateZone(id: number, updateZoneDto: UpdateZoneDto): Promise<Zone> {
    const zone = await this.getZoneById(id);
    Object.assign(zone, updateZoneDto);
    return this.zoneRepo.save(zone);
  }

  async deleteZone(id: number): Promise<void> {
    const zone = await this.getZoneById(id);
    await this.zoneRepo.remove(zone);
  }
}
