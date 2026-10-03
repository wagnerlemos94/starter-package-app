import { Box, Chip, LinearProgress, Paper, Skeleton, Stack, Typography } from '@mui/material';
import { theme } from '@/layout/globalStyles/theme';
const colors = theme.color;
import { dashboardSurface } from './dashboardStyles';
const surface = dashboardSurface;
import type { IDashboardResponse } from '@/hooks/api/dashboard/useApiDashboard';

interface Props { items: IDashboardResponse[]; firstLoad: boolean; error: string | null; }
export default function DashboardCategories({ items, firstLoad, error }: Props) {
  const number = (value: number) => value.toLocaleString('pt-BR');
  return (
<Paper sx={surface}>
              <Stack direction="row" sx={{
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
            gap: 2
        }}><Box><Typography component="h2" sx={{
            fontWeight: 750,
            fontSize: 20
        }}>Cadastros por categoria</Typography><Typography sx={{
            fontSize: 13,
            color: colors.textSecondary,
            mt: 0.5
        }}>Uma leitura rápida de cada área.</Typography></Box><Chip label={`${items.length} categorias`} size="small" sx={{ bgcolor: colors.primarySoft, color: colors.primary }}/></Stack>
              {firstLoad ? <Stack sx={{
                gap: 2
            }}><Skeleton variant="rounded" height={130}/><Skeleton variant="rounded" height={130}/></Stack> : !items.length ? <Box sx={{ py: 5, textAlign: 'center', color: colors.textSecondary }}><Typography>{error ? 'Os dados ainda não estão disponíveis.' : 'Nenhum indicador disponível.'}</Typography></Box> : <Stack sx={{
                gap: 2
            }}>
                {items.map((item, index) => {
                    const ratio = item.total ? Math.round(item.ativos / item.total * 100) : 0;
                    return <Box key={`${item.nome}-${index}`} sx={{ border: `1px solid ${colors.border}`, borderRadius: '14px', p: 2.5 }}>
                    <Stack direction="row" sx={{
                        justifyContent: "space-between",
                        gap: 2
                    }}><Box><Typography sx={{
                        fontWeight: 700
                    }}>{item.nome}</Typography>{item.descricao && <Typography sx={{
                        fontSize: 13,
                        color: colors.textSecondary
                    }}>{item.descricao}</Typography>}</Box><Typography sx={{
                        fontWeight: 800,
                        fontSize: 24
                    }}>{number(item.total)} <Box component="span" sx={{ fontSize: 12, fontWeight: 400, color: colors.textSecondary }}>no total</Box></Typography></Stack>
                    <LinearProgress variant="determinate" value={ratio} aria-label={`${item.nome}: ${ratio}% ativos`} sx={{ height: 8, borderRadius: 4, my: 2, bgcolor: colors.border, '& .MuiLinearProgress-bar': { bgcolor: colors.success, borderRadius: 4 } }}/>
                    <Stack direction="row" sx={{
                        justifyContent: "space-between",
                        gap: 1,
                        flexWrap: "wrap"
                    }}><Typography sx={{
                        fontSize: 13,
                        color: colors.successHover
                    }}>{number(item.ativos)} ativos</Typography><Typography sx={{
                        fontSize: 13,
                        color: colors.textSecondary
                    }}>{number(item.inativos)} inativos</Typography></Stack>
                  </Box>;
                })}
              </Stack>}
            </Paper>
  );
}
