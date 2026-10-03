import { Alert, Box, TextField } from '@mui/material';
import FormComponent from '@/components/FormComponent';
import useFormMinhaConta from '@/features/usuario/useFormMinhaConta';

export default function MinhaConta() {
  const {
    action: { salvar, register },
    data: { cpf, errors, loading, loaded, isSubmitting },
  } = useFormMinhaConta();

  return (
    <FormComponent onSubmit={salvar} titulo="Minha conta" isSubmitting={loading || isSubmitting}>
      {!loading && !loaded && <Alert severity="error" sx={{ mb: 2 }}>Não foi possível carregar sua conta. Recarregue a página para tentar novamente.</Alert>}
      <Box component="fieldset" disabled={!loaded || isSubmitting} sx={{ border: 0, p: 0, m: 0, display: 'grid', gap: 2.5, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
        <TextField {...register('nome')} label="Nome" error={!!errors.nome} helperText={errors.nome?.message} fullWidth slotProps={{ inputLabel: { shrink: true } }} autoComplete="name" />
        <TextField label="CPF" value={cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')} slotProps={{ input: { readOnly: true }, inputLabel: { shrink: true } }} fullWidth />
        <TextField {...register('senhaAtual')} label="Senha atual" type="password" autoComplete="current-password" error={!!errors.senhaAtual} helperText={errors.senhaAtual?.message || 'Informe para alterar sua senha'} fullWidth />
        <TextField {...register('senha')} label="Nova senha" type="password" autoComplete="new-password" error={!!errors.senha} helperText={errors.senha?.message || 'Deixe em branco para manter a senha atual'} fullWidth />
      </Box>
    </FormComponent>
  );
}
