import { Box, Paper, Skeleton, Stack, Typography } from '@mui/material';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import PauseCircleOutlineRoundedIcon from '@mui/icons-material/PauseCircleOutlineRounded';
import { theme } from '@/layout/globalStyles/theme';
const colors = theme.color;
import { dashboardSurface } from './dashboardStyles';
const surface = dashboardSurface;
import type { IDashboardResponse } from '@/hooks/api/dashboard/useApiDashboard';

interface Props { totals: Pick<IDashboardResponse, "total" | "ativos" | "inativos">; firstLoad: boolean; updatedAt: Date | null; }
export default function DashboardSummaryCards({ totals, firstLoad, updatedAt }: Props) {
  const number = (value: number) => value.toLocaleString('pt-BR');
  return (
<Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2.5, mb: 3 }}>
            {[
                { title: 'Total de registros por categoria', value: totals.total, caption: 'Registros cadastrados', icon: <GridViewRoundedIcon />, color: colors.primary, background: colors.primaryLight },
                { title: 'Registros ativos', value: totals.ativos, caption: 'Cadastros com status ativo', icon: <CheckCircleOutlineRoundedIcon />, color: colors.successHover, background: colors.successLight },
                { title: 'Registros inativos', value: totals.inativos, caption: 'Cadastros com status inativo', icon: <PauseCircleOutlineRoundedIcon />, color: colors.textSecondary, background: colors.buttonSecondary },
            ].map((card) => <Paper key={card.title} sx={surface}>
              <Stack direction="row" sx={{
                justifyContent: "space-between",
                alignItems: "center"
            }}><Typography sx={{
                fontSize: 14,
                fontWeight: 600,
                color: colors.textSecondary
            }}>{card.title}</Typography><Box sx={{ display: 'flex', p: 1.2, borderRadius: '12px', color: card.color, bgcolor: card.background }}>{card.icon}</Box></Stack>
              <Typography component="p" sx={{
                ...{ fontSize: 42, fontWeight: 800, letterSpacing: -1.5, my: 1 }
            }}>{firstLoad ? <Skeleton width="50%"/> : updatedAt ? number(card.value) : '—'}</Typography>
              <Typography sx={{
                fontSize: 13,
                color: colors.textSecondary
            }}>{card.caption}</Typography>
            </Paper>)}
          </Box>
  );
}
