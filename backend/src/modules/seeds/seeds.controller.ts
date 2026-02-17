import { Controller, Get, Param, Query } from '@nestjs/common';
import { SeedsService, SeedFilters } from './seeds.service';
import { CropType, WaterRequirement } from './entities/seed.entity';

@Controller('seeds')
export class SeedsController {
  constructor(private readonly seedsService: SeedsService) {}

  @Get()
  async findAll(
    @Query('cropType') cropType?: CropType,
    @Query('waterRequirement') waterRequirement?: WaterRequirement,
    @Query('optimalSoilType') optimalSoilType?: string,
    @Query('phMin') phMin?: string,
    @Query('phMax') phMax?: string,
    @Query('search') search?: string,
  ) {
    const filters: SeedFilters = {};
    if (cropType) filters.cropType = cropType;
    if (waterRequirement) filters.waterRequirement = waterRequirement;
    if (optimalSoilType) filters.optimalSoilType = optimalSoilType;
    if (phMin != null && phMin !== '') filters.phMin = parseFloat(phMin);
    if (phMax != null && phMax !== '') filters.phMax = parseFloat(phMax);
    if (search) filters.search = search;
    return this.seedsService.findAll(filters);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.seedsService.findOne(Number(id));
  }
}
