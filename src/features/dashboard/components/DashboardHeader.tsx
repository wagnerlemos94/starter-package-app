import { Box, Button, Stack, Typography } from '@mui/material';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import { useSession } from 'next-auth/react';
import { theme } from '@/layout/globalStyles/theme';
const colors = theme.color;

interface Props { allowed: boolean; loading: boolean; onRefresh: () => Promise<void>; }
export default function DashboardHeader({ allowed, loading, onRefresh }: Props) {
  const { data: session } = useSession();
  return (
<Stack direction={{ xs: 'column', sm: 'row' }} sx={{
        justifyContent: "space-between",
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: 2,
        mb: 4
    }}>
          <Box>
            <Typography sx={{
        ...{ color: colors.textSecondary, fontSize: 13, fontWeight: 700, letterSpacing: 1.8, mb: 1 }
    }}>PAINEL ADMINISTRATIVO</Typography>
            <Typography component="h1" sx={{
        ...{ fontSize: { xs: 30, md: 38 }, fontWeight: 800, letterSpacing: -1.2 }
    }}>Visão geral</Typography>
            <Typography sx={{
        color: colors.textSecondary,
        mt: 1
    }}>Olá, {session?.user.name?.split(' ')[0] || 'usuário'}. Veja como estão seus cadastros.</Typography>
          </Box>
          {allowed && <Button variant="outlined" startIcon={<RefreshRoundedIcon />} disabled={loading} onClick={() => void onRefresh()} sx={{ borderColor: colors.border, color: colors.primary, bgcolor: colors.white, borderRadius: '12px', px: 2.5, py: 1.2, textTransform: 'none' }}>{loading ? 'Atualizando…' : 'Atualizar dados'}</Button>}
        </Stack>
  );
}
