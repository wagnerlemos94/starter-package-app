import { Box, Paper, Skeleton, Stack, Typography } from '@mui/material';
import { theme } from '@/layout/globalStyles/theme';
const colors = theme.color;
import { dashboardSurface } from './dashboardStyles';
const surface = dashboardSurface;
import type { IDashboardResponse } from '@/hooks/api/dashboard/useApiDashboard';

interface Props { totals: Pick<IDashboardResponse, "total" | "ativos" | "inativos">; firstLoad: boolean; updatedAt: Date | null; }
export default function DashboardStatusDistribution({ totals, firstLoad, updatedAt }: Props) {
  const number = (value: number) => value.toLocaleString('pt-BR');
  const percentage = totals.total ? Math.round(totals.ativos / totals.total * 100) : 0;
  return (
<Paper sx={{ ...surface, display: 'flex', flexDirection: 'column' }}>
              <Typography component="h2" sx={{
            fontWeight: 750,
            fontSize: 20
        }}>Distribuição por status</Typography><Typography sx={{
            fontSize: 13,
            color: colors.textSecondary,
            mt: 0.5
        }}>Visão consolidada dos cadastros.</Typography>
              <Box sx={{ position: 'relative', width: 210, height: 210, mx: 'auto', my: 3 }}>
                {firstLoad ? <Skeleton variant="circular" width={210} height={210}/> : <>
                  <svg viewBox="0 0 200 200" role="img" aria-label={updatedAt ? `${percentage}% de registros ativos; ${number(totals.inativos)} inativos` : 'Distribuição indisponível'}><circle cx="100" cy="100" r="80" fill="none" stroke={colors.border} strokeWidth="17"/><circle cx="100" cy="100" r="80" fill="none" stroke={colors.success} strokeWidth="17" strokeDasharray={`${totals.total ? totals.ativos / totals.total * 502.65 : 0} 502.65`} transform="rotate(-90 100 100)"/></svg>
                  <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}><Typography sx={{
                fontSize: 40,
                fontWeight: 800,
                letterSpacing: -1
            }}>{updatedAt && totals.total ? `${percentage}%` : '—'}</Typography><Typography sx={{
                fontSize: 13,
                color: colors.textSecondary
            }}>{!updatedAt ? 'sem dados' : totals.total ? 'dos registros ativos' : 'sem registros'}</Typography></Box>
                </>}
              </Box>
              <Stack direction="row" sx={{
            justifyContent: "center",
            gap: 3
        }}>{[{ label: 'Ativos', color: colors.success }, { label: 'Inativos', color: colors.textMuted }].map((status) => <Stack key={status.label} direction="row" sx={{
            alignItems: "center",
            gap: 1
        }}><Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: status.color }}/><Typography sx={{
            fontSize: 13,
            color: colors.textSecondary
        }}>{status.label}</Typography></Stack>)}</Stack>
              <Typography sx={{
            ...{ mt: 'auto', pt: 3 },
            fontSize: 12,
            textAlign: "center",
            color: colors.textSecondary
        }}>O status do cadastro não representa acessos ou atividade recente.</Typography>
            </Paper>
  );
}
