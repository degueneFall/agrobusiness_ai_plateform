import api from './api';

export interface Plot {
  id: number;
  userId: number;
  regionId?: number;
  name: string;
  areaHectares: number;
  coordinates?: any;
  soilType?: string;
  soilPh?: number;
  ndviScore?: number;
  lastNdviUpdate?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  region?: { id: number; name: string; code: string };
}

export interface PlotStats {
  total: number;
  avgNdvi: number | null;
  withLowHumidity: number;
}

export const plotsService = {
  getAll: async (): Promise<Plot[]> => {
    const res = await api.get<Plot[]>('/plots');
    return res.data;
  },
  getStats: async (): Promise<PlotStats> => {
    const res = await api.get<PlotStats>('/plots/stats');
    return res.data;
  },
  getOne: async (id: number): Promise<Plot> => {
    const res = await api.get<Plot>(`/plots/${id}`);
    return res.data;
  },
  create: async (data: Partial<Plot>): Promise<Plot> => {
    const res = await api.post<Plot>('/plots', data);
    return res.data;
  },
  update: async (id: number, data: Partial<Plot>): Promise<Plot> => {
    const res = await api.patch<Plot>(`/plots/${id}`, data);
    return res.data;
  },
};
