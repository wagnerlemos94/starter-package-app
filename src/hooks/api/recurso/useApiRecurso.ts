import { PageRequest, PageResponse, ApiResult, apiGet } from '@/services/api';
import { useToast } from '@/components/Toast';

const base = 'recurso';

type UUID = string;

export interface IRecursoResponse {
  id: UUID;
  nome: string;
  chave: string;
  descricao: string;
  ativo: boolean;
}

export const useApiRecurso = () => {
  const { showToast } = useToast();

  const handleErrorToast = (res: ApiResult<unknown>) => {
    if (!res) return showToast('Erro desconhecido', 'error');
    if (!res.success) {
      const msg = res.message || (res.body && (res.body.message || res.body.error)) || `Erro: ${res.status}`;
      showToast(msg, 'error');
    }
  };
  const list = async ({ page = 0, size = 10 }: PageRequest = {}): Promise<ApiResult<PageResponse<IRecursoResponse>>> => {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    const res = await apiGet<PageResponse<IRecursoResponse>>(`${base}?${params}`);
    if (!res.success) handleErrorToast(res);
    return res;
  };

  const getById = async (id: string): Promise<ApiResult<IRecursoResponse>> => {
    const res = await apiGet<IRecursoResponse>(`${base}/${id}`);
    if (!res.success) handleErrorToast(res);
    return res;
  };


  return { list, getById };
};

export default useApiRecurso;
