import api from './api';

export interface SoilData {
    id: number;
    idParcelle: number;
    ph?: number;
    azote?: number;
    phosphore?: number;
    potassium?: number;
    humidite?: number;
    idSol?: number;
    dateMesure: string;
    parcelle?: {
        id: number;
        name: string;
    };
    sol?: {
        typeSol: string;
    };
}

export interface CreateSoilDataDto {
    idParcelle: number;
    ph?: number;
    azote?: number;
    phosphore?: number;
    potassium?: number;
    humidite?: number;
    idSol?: number;
    dateMesure: string;
}

export interface SoilType {
    id: number;
    typeSol: string;
    description?: string;
}

class SoilDataService {
    async getSoilDataByPlot(plotId: number): Promise<SoilData[]> {
        const response = await api.get(`/soil-mapping/soil-data/plot/${plotId}`);
        return response.data;
    }

    async getLatestSoilDataByPlot(plotId: number): Promise<SoilData> {
        const response = await api.get(`/soil-mapping/soil-data/plot/${plotId}/latest`);
        return response.data;
    }

    async createSoilData(data: CreateSoilDataDto): Promise<SoilData> {
        const response = await api.post('/soil-mapping/soil-data', data);
        return response.data;
    }

    async getSoilTypes(): Promise<SoilType[]> {
        const response = await api.get('/soil-mapping/soil-types');
        return response.data;
    }
}

export const soilDataService = new SoilDataService();
