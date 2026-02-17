import api from './api';

export interface Report {
  id: number;
  userId: number;
  reportType?: string;
  title: string;
  parameters?: any;
  filePath?: string;
  status: string;
  createdAt: string;
}

export const reportsService = {
  getAll: async (): Promise<Report[]> => {
    const res = await api.get<Report[]>('/reports');
    return res.data;
  },
  getOne: async (id: number): Promise<Report> => {
    const res = await api.get<Report>(`/reports/${id}`);
    return res.data;
  },
  create: async (data: { title: string; reportType?: string; parameters?: any }): Promise<Report> => {
    const res = await api.post<Report>('/reports', data);
    return res.data;
  },
};
