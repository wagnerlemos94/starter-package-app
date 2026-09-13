import DataTable from '@/layout/components/DataTable';
import AddIcon from '@mui/icons-material/Add';
import { IPerfilResponse } from '@/hooks/api/perfil/useApiPerfil';
import usePerfil from '@/features/perfil/usePerfil';

export default function Perfil() {
  const {
    action: { edit },
    data: { listPerfil, columns, loading },
  } = usePerfil();

  return (
    <>
      <DataTable<IPerfilResponse>
        resource="PERFIL"
        titulo="Lista de Perfis"
        columns={columns}
        data={listPerfil}
        loading={loading}
        buttonCadastro={
          {
            nome: 'novo',
            icon: <AddIcon sx={{ marginRight: 1 }} />,
            redirect: '/perfil/formPerfil',
          }
        }
        action={{
          edit: {
            onChange: (t: IPerfilResponse) => edit(t),
          },
        }}
      />
    </>
  );
}
