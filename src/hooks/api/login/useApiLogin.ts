import { ApiResult, apiPostLogin } from '@/services/api';
import { useToast } from '@/components/Toast';

export interface ILoginRequest {
  cpf: string;
  senha: string;
}

export interface ILoginResponse {
  token?: string;
  expiresInToken?: number;
  nome?: string;
  username?: string;
}

export const useApiLogin = () => {
  const { showToast } = useToast();

  const handleErrorToast = (res: ApiResult<any>) => {
    if (!res) return showToast('Erro desconhecido', 'error');
    if (!res.success) {
      const msg = res.message || (res.body && (res.body.message || res.body.error)) || `Erro: ${res.status}`;
      showToast(msg, 'error');
    }
  };

  const login = async (payload: ILoginRequest): Promise<ApiResult<ILoginResponse>> => {
    const res = await apiPostLogin<ILoginResponse>('auth/login', { cpf: payload.cpf, password: payload.senha });
    if (res.success) {
      showToast('Login realizado com sucesso', 'success');
    } else {
      handleErrorToast(res);
    }
    return res;
  };

  return { login };
};

export default useApiLogin;
