import { useLogin } from "@/features/auth/useLogin";
import { Box, Button, TextField, Paper, Typography, Grid, FormControlLabel, Checkbox, Link, IconButton } from "@mui/material";
import { Controller } from "react-hook-form";
import TextFieldMask from "@/components/TextFieldMask";
import Loading from "@/components/Loading";
import { theme } from "@/layout/globalStyles/theme";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { appConfig } from "@/config/appConfig";

export default function LoginPage() {

  const {
    action: {
      login,
      register,
      setIsVisible
    },
    data: {
      isSubmitting,
      isVisible,
      errors,
      control
    }
  } = useLogin();

  return (
    <>
      <Paper elevation={3} sx={{ width: '100%', height: '100vh', borderRadius: 0, overflow: 'hidden', display: 'flex' }}>
        {/* Left panel - visual */}
        <Box sx={{ width: '50%', height: '100%', background: theme.color.primary, color: theme.color.white, p: 6, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box sx={{ width: 48, height: 48, borderRadius: '50%', background: theme.color.warning, display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.color.black, fontWeight: 700 }}>SP</Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>{appConfig.nomeSistema}</Typography>
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '1.2rem' }}>{appConfig.description}</Typography>
          </Box>

        </Box>

        {/* Right panel - form */}
        <Box sx={{ width: '50%', height: '100%', p: 8, background: theme.color.white, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ width: '100%', maxWidth: 420 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Bem-vindo de volta!</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>Faça login para acessar a plataforma</Typography>

            <Box component="form" onSubmit={login} noValidate>
              <Grid container spacing={4}>
                <Controller
                  name="cpf"
                  control={control}
                  render={({ field }) => (
                    <TextFieldMask
                      {...field}
                      error={!!errors.cpf}
                      helperText={errors.cpf?.message}
                      id="cpf"
                      label="CPF"
                      placeholder="000.000.000-00"
                      fullWidth
                      mask="999.999.999-99"
                    />
                  )}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>

                  <TextField
                    error={!!errors.senha}
                    helperText={errors.senha?.message}
                    id="senha"
                    label={control._formValues?.senha ? "" : "Senha"}
                    placeholder="Digite sua senha"
                    defaultValue=""
                    fullWidth
                    type={isVisible ? "text" : "password"}
                    {...register("senha")}
                  />
                  <IconButton
                    sx={{ marginLeft: '-50px' }}
                    aria-label={
                      isVisible ? 'hide the password' : 'display the password'
                    }
                    onClick={() => setIsVisible(!isVisible)}
                    edge="end"
                  >
                    {isVisible ? <VisibilityOff /> : <Visibility />}
                  </IconButton>

                </Box>
              </Grid>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, marginBottom: 24 }}>
                <FormControlLabel control={<Checkbox />} label="Lembrar-me" />
                <Link href="#" underline="none">Esqueci minha senha</Link>
              </div>

              <Button type="submit" variant="contained" fullWidth sx={{ backgroundColor: theme.color.primary, height: 44 }}>Entrar</Button>
            </Box>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>© 2026 {appConfig.nomeSistema}. Todos os direitos reservados.</Typography>
            </Box>

            <Loading isLoading={isSubmitting} />
          </Box>
        </Box>
      </Paper>
    </>
  );
}
