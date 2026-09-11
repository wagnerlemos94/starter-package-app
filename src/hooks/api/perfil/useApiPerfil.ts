import { ApiResult, apiGet, apiPost, apiPut, apiDelete } from '@/services/api';
import { useToast } from '@/components/Toast';

const base = 'perfil';

type UUID = string;

export interface IPerfilRequest {
    id?: UUID;
    nome: string;
    descricao: string;
    ativo: boolean;
    perfilRecurso: Record<UUID, UUID[]>;
}

export interface IPerfilResponse {
    id: UUID;
    nome: string;
    chave?: string;
    descricao: string;
    ativo: boolean | string;
    perfilRecurso?: Record<UUID, UUID[]>;
    perfilRecursoResponse?: Array<{
        id: UUID;
        recursoId: UUID;
        recurso: string;
        permissoes?: Array<{
            id: UUID;
            nome: string;
            chave: string;
            descricao: string;
            ativo: boolean;
        }>;
    }>;
}

export const useApiPerfil = () => {
    const { showToast } = useToast();

    const handleErrorToast = (res: ApiResult<any>) => {
        if (!res) return showToast('Erro desconhecido', 'error');
        if (!res.success) {
            const msg = res.message || (res.body && (res.body.message || res.body.error)) || `Erro: ${res.status}`;
            showToast(msg, 'error');
        }
    };

    const list = async (): Promise<ApiResult<IPerfilResponse[]>> => {
        const res = await apiGet<IPerfilResponse[]>(`${base}`);
        if (!res.success) handleErrorToast(res);
        return res;
    };

    const getById = async (id: string): Promise<ApiResult<IPerfilResponse>> => {
        const res = await apiGet<IPerfilResponse>(`${base}/${id}`);
        if (!res.success) handleErrorToast(res);
        return res;
    };

    const create = async (payload: IPerfilRequest): Promise<ApiResult<IPerfilResponse>> => {
        const res = await apiPost<IPerfilResponse>(`${base}`, payload);
        if (res.success) showToast('Perfil criado com sucesso', 'success');
        else handleErrorToast(res);
        return res;
    };

    const update = async (id: string, payload: IPerfilRequest): Promise<ApiResult<IPerfilResponse>> => {
        const res = await apiPut<IPerfilResponse>(`${base}/${id}`, payload);
        if (res.success) showToast('Perfil atualizado com sucesso', 'success');
        else handleErrorToast(res);
        return res;
    };

    const remove = async (id: string): Promise<ApiResult<IPerfilResponse>> => {
        const res = await apiDelete<IPerfilResponse>(`${base}/${id}`);
        if (res.success) showToast('Perfil removido com sucesso', 'success');
        else handleErrorToast(res);
        return res;
    };

    return { list, getById, create, update, remove };
};

export default useApiPerfil;
