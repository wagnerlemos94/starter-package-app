import { useToast } from '@/components/Toast';
import { IUsuarioResponse, useApiUsuario } from '@/hooks/api/usuario/useApiUsuario';
import router from 'next/router';
import { useEffect, useRef, useState } from 'react';

const useUsuario = () => {
  const [listUsuario, setListUsuario] = useState<IUsuarioResponse[]>([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const requestId = useRef(0);
  const [loading, setLoading] = useState<boolean>(false);
  const { showToast } = useToast();
  const { list, remove } = useApiUsuario();

  const columns = [
    { key: 'nome', label: 'Nome' },
    { key: 'cpf', label: 'CPF' },
    { key: 'ativo', label: 'Status' },
    {
      key: 'perfil',
      label: 'Perfil',
      render: (_value: unknown, row: IUsuarioResponse) => row.perfil ?? '-',
    },
  ];

  const del = (t: IUsuarioResponse) => {
    (async () => {
      try {
        const res = await remove(String(t.id));
        if (res && res.success) {
          await buscarUsuarios();
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
    const currentRequest = ++requestId.current;
    setLoading(true);
    try {
      const response = await list({ page, size });
      if (currentRequest !== requestId.current) return response;
      if (response && response.success) {
        setTotalElements(response.data.totalElements);
        const lastPage = Math.max(0, response.data.totalPages - 1);
        if (page > lastPage) { setPage(lastPage); return response; }
        setListUsuario(response.data.content.map((item: IUsuarioResponse) => ({
          ...item,
          ativo: item.ativo ? 'Ativo' : 'Inativo',
        })) || []);
      }
      return response;
    } catch {
      showToast('Erro ao buscar usuários', 'error');
    } finally {
      if (currentRequest === requestId.current) setLoading(false);
    }
  };

  useEffect(() => {
    const carregarUsuarios = async () => {
      await buscarUsuarios();
    };

    void carregarUsuarios();
    return () => { requestId.current += 1; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size]);

  return {
    action: {
      buscarUsuarios,
      setListUsuario,
      del,
      edit,
    },
    data: {
      listUsuario,
      pagination: { page, rowsPerPage: size, totalElements, onPageChange: setPage, onRowsPerPageChange: (value: number) => { setSize(value); setPage(0); } },
      columns,
      loading,
    },
  };
};

export default useUsuario;
