import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { DonneesSol } from './entities/donnees-sol.entity';
import { DonneesClimat } from './entities/donnees-climat.entity';
import { Sol } from './entities/sol.entity';
import { Climat } from './entities/climat.entity';
import { CreateDonneesSolDto } from './dto/create-donnees-sol.dto';
import { CreateDonneesClimatDto } from './dto/create-donnees-climat.dto';

@Injectable()
export class SoilMappingService {
    constructor(
        @InjectRepository(DonneesSol)
        private donneesSolRepo: Repository<DonneesSol>,
        @InjectRepository(DonneesClimat)
        private donneesClimatRepo: Repository<DonneesClimat>,
        @InjectRepository(Sol)
        private solRepo: Repository<Sol>,
        @InjectRepository(Climat)
        private climatRepo: Repository<Climat>,
    ) { }

    // Sol reference data
    async getAllSoilTypes(): Promise<Sol[]> {
        return this.solRepo.find({ order: { typeSol: 'ASC' } });
    }

    // Climat reference data
    async getAllClimateTypes(): Promise<Climat[]> {
        return this.climatRepo.find({ order: { typeClimat: 'ASC' } });
    }

    // Données Sol (Soil Analysis)
    async getSoilDataByPlot(plotId: number): Promise<DonneesSol[]> {
        return this.donneesSolRepo.find({
            where: { idParcelle: plotId },
            relations: ['parcelle', 'sol'],
            order: { dateMesure: 'DESC' },
        });
    }

    async getLatestSoilDataByPlot(plotId: number): Promise<DonneesSol> {
        const data = await this.donneesSolRepo.findOne({
            where: { idParcelle: plotId },
            relations: ['parcelle', 'sol'],
            order: { dateMesure: 'DESC' },
        });

        if (!data) {
            throw new NotFoundException(`No soil data found for plot ${plotId}`);
        }

        return data;
    }

    async createSoilData(createDto: CreateDonneesSolDto): Promise<DonneesSol> {
        const data = this.donneesSolRepo.create(createDto);
        return this.donneesSolRepo.save(data);
    }

    // Données Climat (Climate Data)
    async getClimateDataByZone(zoneId: number): Promise<DonneesClimat[]> {
        return this.donneesClimatRepo.find({
            where: { idZone: zoneId },
            relations: ['zone', 'climat'],
            order: { dateMesure: 'DESC' },
        });
    }

    async getClimateDataByZoneAndDateRange(
        zoneId: number,
        startDate: Date,
        endDate: Date,
    ): Promise<DonneesClimat[]> {
        return this.donneesClimatRepo.find({
            where: {
                idZone: zoneId,
                dateMesure: Between(startDate, endDate),
            },
            relations: ['zone', 'climat'],
            order: { dateMesure: 'DESC' },
        });
    }

    async createClimateData(createDto: CreateDonneesClimatDto): Promise<DonneesClimat> {
        const data = this.donneesClimatRepo.create(createDto);
        return this.donneesClimatRepo.save(data);
    }
}
