import { useToast } from '@/components/Toast';
import { IPerfilResponse, useApiPerfil } from '@/hooks/api/perfil/useApiPerfil';
import router from 'next/router';
import { useEffect, useState } from 'react';

const usePerfil = () => {
  const [listPerfil, setListPerfil] = useState<IPerfilResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { showToast } = useToast();
  const { list, remove } = useApiPerfil();

  const columns = [
    { key: 'nome', label: 'Nome' },
    { key: 'chave', label: 'Key' },
    { key: 'descricao', label: 'Descrição' },
    { key: 'ativo', label: 'Status' },
  ];

  useEffect(() => {
    buscarPerfis();
  }, []);

  const del = (t: IPerfilResponse) => {
    (async () => {
      try {
        const res = await remove(String(t.id));
        if (res && res.success) {
          setListPerfil((prev) => prev.filter((item) => item.id !== t.id));
          showToast('Perfil removido com sucesso', 'success');
        }
      } catch (error) {
        console.error('Erro ao deletar perfil', error);
      }
    })();
  };

  const edit = (t: IPerfilResponse) => {
    router.push({
      pathname: '/perfil/formPerfil',
      query: { id: t.id },
    });
  };

  const buscarPerfis = async () => {
    setLoading(true);
    try {
      const response = await list();
      if (response && response.success) {
        setListPerfil(response.data.map((item: IPerfilResponse) => ({
          ...item,
          active: item.ativo ? 'Ativo' : 'Inativo',
        })) || []);
      }
      return response;
    } catch (error) {
      console.error('Erro ao buscar perfis', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    action: {
      buscarPerfis,
      setListPerfil,
      del,
      edit,
    },
    data: {
      listPerfil,
      columns,
      loading,
    },
  };
};

export default usePerfil;
