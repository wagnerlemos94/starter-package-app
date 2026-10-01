import { useToast } from '@/components/Toast';
import { IPerfilResponse, useApiPerfil } from '@/hooks/api/perfil/useApiPerfil';
import router from 'next/router';
import { useEffect, useRef, useState } from 'react';

const usePerfil = () => {
  const [listPerfil, setListPerfil] = useState<IPerfilResponse[]>([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const requestId = useRef(0);
  const [loading, setLoading] = useState<boolean>(false);
  const { showToast } = useToast();
  const { list, remove } = useApiPerfil();

  const columns = [
    { key: 'nome', label: 'Nome' },
    { key: 'descricao', label: 'Descrição' },
    { key: 'ativo', label: 'Status' },
  ];

  const del = (t: IPerfilResponse) => {
    (async () => {
      try {
        const res = await remove(String(t.id));
        if (res && res.success) {
          await buscarPerfis();
          showToast('Perfil removido com sucesso', 'success');
        }
      } catch {
        showToast('Erro ao remover perfil', 'error');
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
    const currentRequest = ++requestId.current;
    setLoading(true);
    try {
      const response = await list({ page, size });
      if (currentRequest !== requestId.current) return response;
      if (response && response.success) {
        setTotalElements(response.data.totalElements);
        const lastPage = Math.max(0, response.data.totalPages - 1);
        if (page > lastPage) { setPage(lastPage); return response; }
        setListPerfil(response.data.content.map((item: IPerfilResponse) => ({
          ...item,
          nome: item.nome.toUpperCase(),
          ativo: item.ativo ? 'Ativo' : 'Inativo',
        })) || []);
      }
      return response;
    } catch {
      showToast('Erro ao buscar perfis', 'error');
    } finally {
      if (currentRequest === requestId.current) setLoading(false);
    }
  };

  useEffect(() => {
    const carregarPerfis = async () => {
      await buscarPerfis();
    };

    void carregarPerfis();
    return () => { requestId.current += 1; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size]);

  return {
    action: {
      buscarPerfis,
      setListPerfil,
      del,
      edit,
    },
    data: {
      listPerfil,
      pagination: { page, rowsPerPage: size, totalElements, onPageChange: setPage, onRowsPerPageChange: (value: number) => { setSize(value); setPage(0); } },
      columns,
      loading,
    },
  };
};

export default usePerfil;
