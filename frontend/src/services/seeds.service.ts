import api from './api';

export interface Seed {
  id: number;
  name: string;
  varietyCode?: string;
  cropType: string;
  description?: string;
  imageUrl?: string;
  yieldPotential?: number;
  growthCycleDays?: number;
  waterRequirement?: string;
  optimalSoilType?: string;
  optimalPhMin?: number;
  optimalPhMax?: number;
  droughtResistant: boolean;
  nitrogenEfficient: boolean;
  pricePerKg?: number;
  supplier?: string;
  isActive: boolean;
}

export const seedsService = {
  getAll: async (params?: { cropType?: string; waterRequirement?: string; optimalSoilType?: string; phMin?: number; phMax?: number; search?: string }): Promise<Seed[]> => {
    const res = await api.get<Seed[]>('/seeds', { params });
    return res.data;
  },
  getOne: async (id: number): Promise<Seed> => {
    const res = await api.get<Seed>(`/seeds/${id}`);
    return res.data;
  },
};
