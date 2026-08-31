import { useToast } from '@/components/Toast';
import { IUsuarioResponse, useApiUsuario } from '@/hooks/api/usuario/useApiUsuario';
import router from 'next/router';
import { useEffect, useState } from 'react';

const useUsuario = () => {
  const [listUsuario, setListUsuario] = useState<IUsuarioResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { showToast } = useToast();
  const { list, remove } = useApiUsuario();

  const columns = [
    { key: 'name', label: 'Nome' },
    { key: 'cpf', label: 'CPF' },
    { key: 'active', label: 'Status' },
    {
      key: 'profile',
      label: 'Perfil',
      render: (_value: unknown, row: IUsuarioResponse) => row.profile?.name ?? '-',
    },
  ];

  useEffect(() => {
    buscarUsuarios();
  }, []);

  const del = (t: IUsuarioResponse) => {
    (async () => {
      try {
        const res = await remove(String(t.id));
        if (res && res.success) {
          setListUsuario((prev) => prev.filter((item) => item.id !== t.id));
          showToast('Usuário removido com sucesso', 'success');
        }
      } catch (error) {
        console.error('Erro ao deletar usuário', error);
      }
    })();
  };

  const edit = (t: IUsuarioResponse) => {
    router.push({
      pathname: '/usuario/formUsuario',
      query: { id: t.id },
    });
  };

  const buscarUsuarios = async () => {
    setLoading(true);
    try {
      const response = await list();
      if (response && response.success) {
        setListUsuario(response.data.map((item: IUsuarioResponse) => ({
          ...item,
          active: item.active ? 'Ativo' : 'Inativo',
        })) || []);
      }
      return response;
    } catch (error) {
      console.error('Erro ao buscar usuários', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    action: {
      buscarUsuarios,
      setListUsuario,
      del,
      edit,
    },
    data: {
      listUsuario,
      columns,
      loading,
    },
  };
};

export default useUsuario;
