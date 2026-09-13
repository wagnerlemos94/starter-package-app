import DataTable from '@/layout/components/DataTable';
import AddIcon from '@mui/icons-material/Add';
import { IUsuarioResponse } from '@/hooks/api/usuario/useApiUsuario';
import useUsuario from '@/features/usuario/useUsuario';

export default function Usuario() {
  const {
    action: { edit },
    data: { listUsuario, columns, loading },
  } = useUsuario();

  return (
    <>
      <DataTable<IUsuarioResponse>
        resource='USUARIO'
        titulo="Lista de Usuários"
        columns={columns}
        data={listUsuario}
        loading={loading}
        buttonCadastro={{
          nome: 'novo',
          icon: <AddIcon sx={{ marginRight: 1 }} />,
          redirect: '/usuario/formUsuario',
        }}
        action={{
          edit: {
            onChange: (t: IUsuarioResponse) => edit(t),
          },
        }}
      />
    </>
  );
}
