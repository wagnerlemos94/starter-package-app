import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Box, Button, Paper, Typography } from '@mui/material';
import { useRouter } from 'next/router';

export default function NaoAutorizado() {
  const router = useRouter();

  return (
    <Box
      component="main"
      sx={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 128px)',
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
          maxWidth: 520,
          p: { xs: 4, sm: 6 },
          textAlign: 'center',
          width: '100%',
        }}
      >
        <LockOutlinedIcon color="warning" sx={{ fontSize: 56, mb: 2 }} />
        <Typography component="h1" variant="h4" gutterBottom>
          Acesso não autorizado
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Seu usuário não possui a permissão necessária para acessar esta página.
        </Typography>
        <Button variant="contained" onClick={() => router.push('/')}>
          Voltar ao início
        </Button>
      </Paper>
    </Box>
  );
}
