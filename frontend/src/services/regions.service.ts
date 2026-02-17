import api from './api';

export interface Region {
  id: number;
  name: string;
  code: string;
  country?: string;
  climateZone?: string;
  averageRainfall?: number;
}

export const regionsService = {
  getAll: async (): Promise<Region[]> => {
    const res = await api.get<Region[]>('/system-admin/regions');
    return res.data;
  },
};
