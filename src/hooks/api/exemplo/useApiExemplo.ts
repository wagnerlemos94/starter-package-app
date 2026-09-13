import { ApiResult, apiGet, apiPost, apiPut, apiDelete } from '@/services/api';
import { useToast } from '@/components/Toast';
import { EnderecoSchema } from '@/schemas/enderecoSchema';
import { ContatoSchema } from '@/schemas/contatoSchema';

const base = 'exemplo';

export interface IExemploResponse {
  id?: number;
  nome: string;
  nascimento?: string;
  cpf: string;
  rg: string;
  responsavel?: string;
  endereco?: EnderecoSchema;
  contato?: ContatoSchema[];
}

export interface IExemploRequest {
  nome: string;
  nascimento?: string | Date;
  cpf: string;
  rg: string;
  responsavel?: string;
  endereco?: EnderecoSchema;
  contato?: ContatoSchema[];
}

export const useApiExemplo = () => {
  const { showToast } = useToast();

  const handleErrorToast = (res: ApiResult<unknown>) => {
    if (!res) {
      showToast('Erro desconhecido', 'error');
      return;
    }
    if (!res.success) {
      const msg = res.message || (res.body && (res.body.message || res.body.error)) || `Erro: ${res.status}`;
      showToast(msg, 'error');
    }
  };

  const list = async (): Promise<ApiResult<IExemploResponse[]>> => {
    const res = await apiGet<IExemploResponse[]>(`${base}`);
    if (!res.success) handleErrorToast(res);
    return res;
  };

  const getById = async (id: string): Promise<ApiResult<IExemploResponse>> => {
    const res = await apiGet<IExemploResponse>(`${base}/${id}`);
    if (!res.success) handleErrorToast(res);
    return res;
  };

  const create = async (payload: IExemploRequest): Promise<ApiResult<IExemploResponse>> => {
    const res = await apiPost<IExemploResponse>(`${base}`, payload);
    if (res.success) {
      showToast('Criado com sucesso', 'success');
    } else {
      handleErrorToast(res);
    }
    return res;
  };

  const update = async (id: string, payload: IExemploRequest): Promise<ApiResult<IExemploResponse>> => {
    const res = await apiPut<IExemploResponse>(`${base}/${id}`, payload);
    if (res.success) {
      showToast('Atualizado com sucesso', 'success');
    } else {
      handleErrorToast(res);
    }
    return res;
  };

  const remove = async (id: string): Promise<ApiResult<IExemploResponse>> => {
    const res = await apiDelete<IExemploResponse>(`${base}/${id}`);
    if (res.success) {
      showToast('Removido com sucesso', 'success');
    } else {
      handleErrorToast(res);
    }
    return res;
  };

  return { list, getById, create, update, remove };
};

export default useApiExemplo;
