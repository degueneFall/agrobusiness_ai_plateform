import { Controller, Get, Post, Param, Body, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { SoilMappingService } from './soil-mapping.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { CreateDonneesSolDto } from './dto/create-donnees-sol.dto';
import { CreateDonneesClimatDto } from './dto/create-donnees-climat.dto';

@Controller('soil-mapping')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SoilMappingController {
    constructor(private readonly soilMappingService: SoilMappingService) { }

    // Reference data endpoints
    @Get('soil-types')
    async getAllSoilTypes() {
        return this.soilMappingService.getAllSoilTypes();
    }

    @Get('climate-types')
    async getAllClimateTypes() {
        return this.soilMappingService.getAllClimateTypes();
    }

    // Soil data endpoints
    @Get('soil-data/plot/:plotId')
    async getSoilDataByPlot(@Param('plotId', ParseIntPipe) plotId: number) {
        return this.soilMappingService.getSoilDataByPlot(plotId);
    }

    @Get('soil-data/plot/:plotId/latest')
    async getLatestSoilDataByPlot(@Param('plotId', ParseIntPipe) plotId: number) {
        return this.soilMappingService.getLatestSoilDataByPlot(plotId);
    }

    @Post('soil-data')
    @Roles(UserRole.AGRONOMIST, UserRole.ADMIN, UserRole.SUPER_ADMIN)
    async createSoilData(@Body() createDto: CreateDonneesSolDto) {
        return this.soilMappingService.createSoilData(createDto);
    }

    // Climate data endpoints
    @Get('climate-data/zone/:zoneId')
    async getClimateDataByZone(@Param('zoneId', ParseIntPipe) zoneId: number) {
        return this.soilMappingService.getClimateDataByZone(zoneId);
    }

    @Get('climate-data/zone/:zoneId/range')
    async getClimateDataByZoneAndDateRange(
        @Param('zoneId', ParseIntPipe) zoneId: number,
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
    ) {
        return this.soilMappingService.getClimateDataByZoneAndDateRange(
            zoneId,
            new Date(startDate),
            new Date(endDate),
        );
    }

    @Post('climate-data')
    @Roles(UserRole.AGRONOMIST, UserRole.ADMIN, UserRole.SUPER_ADMIN)
    async createClimateData(@Body() createDto: CreateDonneesClimatDto) {
        return this.soilMappingService.createClimateData(createDto);
    }
}
