import api from './api';

export interface AiRecommendation {
  id: number;
  plotId: number;
  seedId: number;
  compatibilityScore: number;
  recommendationType?: string;
  reasoning?: any;
  expectedYield?: number;
  confidenceLevel?: number;
  modelVersion?: string;
  createdAt: string;
  seed?: { id: number; name: string; cropType: string; yieldPotential?: number };
  plot?: { id: number; name: string };
}

export const aiCompatibilityService = {
  getRecommendations: async (plotId?: number): Promise<AiRecommendation[]> => {
    const res = await api.get<AiRecommendation[]>('/ai-compatibility', plotId ? { params: { plotId } } : undefined);
    return res.data;
  },
  getCompatibility: async (plotId: number, seedId: number): Promise<{ compatibilityScore: number; confidenceLevel: number; expectedYield: number | null; reasoning: string[] }> => {
    const res = await api.get('/ai-compatibility/compatibility', { params: { plotId, seedId } });
    return res.data;
  },
};
