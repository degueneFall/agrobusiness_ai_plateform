import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { SystemAdminService } from './system-admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';

@Controller('system-admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SystemAdminController {
  constructor(private readonly systemAdminService: SystemAdminService) { }

  // Regions endpoints
  @Get('regions')
  async getRegions() {
    return this.systemAdminService.getRegions();
  }

  // Zones endpoints
  @Get('zones')
  async getAllZones() {
    return this.systemAdminService.getAllZones();
  }

  @Get('zones/:id')
  async getZoneById(@Param('id', ParseIntPipe) id: number) {
    return this.systemAdminService.getZoneById(id);
  }

  @Get('regions/:regionId/zones')
  async getZonesByRegion(@Param('regionId', ParseIntPipe) regionId: number) {
    return this.systemAdminService.getZonesByRegion(regionId);
  }

  @Post('zones')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async createZone(@Body() createZoneDto: CreateZoneDto) {
    return this.systemAdminService.createZone(createZoneDto);
  }

  @Patch('zones/:id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async updateZone(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateZoneDto: UpdateZoneDto,
  ) {
    return this.systemAdminService.updateZone(id, updateZoneDto);
  }

  @Delete('zones/:id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async deleteZone(@Param('id', ParseIntPipe) id: number) {
    await this.systemAdminService.deleteZone(id);
    return { message: 'Zone deleted successfully' };
  }
}
