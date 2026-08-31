import { ApiResult, apiGet } from '@/services/api';
import { useToast } from '@/components/Toast';

const base = 'permission';

type UUID = string;

export interface IPermissaoResponse {
  id: UUID;
  nome: string;
  chave: string;
  descricao: string;
  ativo: boolean;
}

export const useApiPermissao = () => {
  const { showToast } = useToast();

  const handleErrorToast = (res: ApiResult<any>) => {
    if (!res) return showToast('Erro desconhecido', 'error');
    if (!res.success) {
      const msg = res.message || (res.body && (res.body.message || res.body.error)) || `Erro: ${res.status}`;
      showToast(msg, 'error');
    }
  };

  const list = async (): Promise<ApiResult<IPermissaoResponse[]>> => {
    const res = await apiGet<IPermissaoResponse[]>(`${base}`);
    if (!res.success) handleErrorToast(res);
    return res;
  };

  const getById = async (id: string): Promise<ApiResult<IPermissaoResponse>> => {
    const res = await apiGet<IPermissaoResponse>(`${base}/${id}`);
    if (!res.success) handleErrorToast(res);
    return res;
  };

  return { list, getById };
};

export default useApiPermissao;
