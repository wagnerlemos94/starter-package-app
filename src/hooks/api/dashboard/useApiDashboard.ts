import { apiGet, ApiResult } from '@/services/api';

export interface IDashboardResponse {
  nome: string;
  descricao: string | null;
  total: number;
  ativos: number;
  inativos: number;
}

const list = (): Promise<ApiResult<IDashboardResponse[]>> => apiGet('dashboard');

export function useApiDashboard() {
  return { list };
}
