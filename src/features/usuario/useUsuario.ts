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
      render: (_value: unknown, row: IUsuarioResponse) => row.profile?.nome ?? '-',
    },
  ];

  const del = (t: IUsuarioResponse) => {
    (async () => {
      try {
        const res = await remove(String(t.id));
        if (res && res.success) {
          setListUsuario((prev) => prev.filter((item) => item.id !== t.id));
          showToast('Usuário removido com sucesso', 'success');
        }
      } catch {
        showToast('Erro ao remover usuário', 'error');
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
    } catch {
      showToast('Erro ao buscar usuários', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void buscarUsuarios();
    // A listagem deve ser carregada uma vez na montagem da página.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
