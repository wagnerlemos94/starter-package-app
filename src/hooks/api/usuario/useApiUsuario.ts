import { PageRequest, PageResponse, ApiResult, apiGet, apiPost, apiPut, apiDelete } from '@/services/api';
import { useToast } from '@/components/Toast';

const base = 'usuario';

type UUID = string;

export interface IUsuarioRequest {
  id?: UUID;
  cpf: string;
  name: string;
  profileId: UUID;
  password?: string;
  active: boolean;
}

export interface IUsuarioResponse {
  id: UUID;
  cpf: string;
  name: string;
  active: boolean | string;
  profile: string;
  profileId: UUID;
}

export interface IUsuarioContaRequest {
  name: string;
  password?: string;
  currentPassword?: string;
}

export const useApiUsuario = () => {
  const { showToast } = useToast();

  const handleErrorToast = (res: ApiResult<unknown>) => {
    if (!res) return showToast('Erro desconhecido', 'error');
    if (!res.success) {
      const msg = res.message || (res.body && (res.body.message || res.body.error)) || `Erro: ${res.status}`;
      showToast(msg, 'error');
    }
  };
  const list = async ({ page = 0, size = 10 }: PageRequest = {}): Promise<ApiResult<PageResponse<IUsuarioResponse>>> => {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    const res = await apiGet<PageResponse<IUsuarioResponse>>(`${base}?${params}`);
    if (!res.success) handleErrorToast(res);
    return res;
  };

  const getById = async (id: string): Promise<ApiResult<IUsuarioResponse>> => {
    const res = await apiGet<IUsuarioResponse>(`${base}/${id}`);
    if (!res.success) handleErrorToast(res);
    return res;
  };

  const create = async (payload: IUsuarioRequest): Promise<ApiResult<IUsuarioResponse>> => {
    const res = await apiPost<IUsuarioResponse>(`${base}`, payload);
    if (res.success) showToast('Usuário criado com sucesso', 'success');
    else handleErrorToast(res);
    return res;
  };

  const update = async (id: string, payload: IUsuarioRequest): Promise<ApiResult<IUsuarioResponse>> => {
    const res = await apiPut<IUsuarioResponse>(`${base}/${id}`, payload);
    if (res.success) showToast('Usuário atualizado com sucesso', 'success');
    else handleErrorToast(res);
    return res;
  };

  const remove = async (id: string): Promise<ApiResult<IUsuarioResponse>> => {
    const res = await apiDelete<IUsuarioResponse>(`${base}/${id}`);
    if (res.success) showToast('Usuário removido com sucesso', 'success');
    else handleErrorToast(res);
    return res;
  };


  const getCurrent = async (): Promise<ApiResult<IUsuarioResponse>> => {
    const res = await apiGet<IUsuarioResponse>(`${base}/me`);
    if (!res.success) handleErrorToast(res);
    return res;
  };

  const updateCurrent = async (payload: IUsuarioContaRequest): Promise<ApiResult<IUsuarioResponse>> => {
    const res = await apiPut<IUsuarioResponse>(`${base}/me`, payload);
    if (!res.success) handleErrorToast(res);
    return res;
  };

  return { list, getById, create, update, remove, getCurrent, updateCurrent };
};

export default useApiUsuario;
