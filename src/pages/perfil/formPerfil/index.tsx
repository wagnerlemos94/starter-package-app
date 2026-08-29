import FormComponent from '@/components/FormComponent';
import useFormPerfil from './useFormPerfil';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Controller } from 'react-hook-form';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import Paper from '@mui/material/Paper';

export default function FormPerfil() {
  const {
    action: { salvar, register },
    data: { isSubmitting, errors, control, loading, listRecurso, listPermissao, profilesResource },
  } = useFormPerfil();

  return (
    <>
      <FormComponent
        onSubmit={salvar}
        titulo="Formulário de Cadastro Perfil"
        isSubmitting={isSubmitting || loading}
      >
        <Box
          sx={{
            m: 1,
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
          }}
        >
          <Box sx={{ width: '32%', display: 'flex', m: 1 }}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  label="Nome"
                  fullWidth
                  focused={true}
                  {...register("name")}
                />
              )}
            />
          </Box>

          <Box sx={{ width: '32%', display: 'flex', m: 1 }}>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...register("description")}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  label="Descrição"
                  fullWidth
                  focused={true}
                />
              )}
            />
          </Box>

          <Box sx={{ width: '20%', display: 'flex', m: 1, alignItems: 'center' }}>
            <Controller
              name="active"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={!!field.value}
                      onChange={(_e, checked) => field.onChange(checked)}
                      color="success"
                    />
                  }
                  label="Ativo"
                />
              )}
            />
          </Box>

          <Box sx={{ width: '100%', m: 1, mt: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Recursos e Permissões
            </Typography>

            {profilesResource.map((item, index) => {
              const recurso = listRecurso.find((r) => r.id === item.resourceId);
              return (
                <Paper key={item.resourceId} variant="outlined" sx={{ width: '100%', mb: 2, p: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    {recurso?.name ?? item.resourceId}
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block', mb: 1.5, color: 'text.secondary' }}>
                    {recurso?.description ?? ''}
                  </Typography>

                  <Box>
                    <Controller
                      name={`profilesResource.${index}.permissionIds`}
                      control={control}
                      render={({ field }) => {
                        const selected = Array.isArray(field.value) ? field.value : [];
                        return (
                          <FormGroup row>
                            {listPermissao.map((permissao, key) => {
                                const checked = selected.includes(permissao.id);
                              return (
                                <FormControlLabel
                                  key={permissao.id}
                                  control={
                                    <Checkbox
                                      checked={checked}
                                      onChange={(_e, isChecked) => {
                                        if (isChecked) {
                                          field.onChange([...selected, permissao.id]);
                                          return;
                                        }
                                        field.onChange(selected.filter((id: string) => id !== permissao.id));
                                      }}
                                    />
                                  }
                                  label={permissao.name}
                                />
                              );
                            })}
                          </FormGroup>
                        );
                      }}
                    />
                  </Box>
                </Paper>
              );
            })}
          </Box>
        </Box>
      </FormComponent>
    </>
  );
}
