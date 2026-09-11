import { ApiResult, apiGet } from '@/services/api';
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

  const handleErrorToast = (res: ApiResult<any>) => {
    if (!res) return showToast('Erro desconhecido', 'error');
    if (!res.success) {
      const msg = res.message || (res.body && (res.body.message || res.body.error)) || `Erro: ${res.status}`;
      showToast(msg, 'error');
    }
  };

  const list = async (): Promise<ApiResult<IRecursoResponse[]>> => {
    const res = await apiGet<IRecursoResponse[]>(`${base}`);
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
