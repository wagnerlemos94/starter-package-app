import Head from 'next/head';
import { Alert, Box, Button, Typography } from '@mui/material';
import useDashboard from '@/features/dashboard/useDashboard';
import DashboardHeader from '@/features/dashboard/components/DashboardHeader';
import DashboardSummaryCards from '@/features/dashboard/components/DashboardSummaryCards';
import DashboardCategories from '@/features/dashboard/components/DashboardCategories';
import DashboardStatusDistribution from '@/features/dashboard/components/DashboardStatusDistribution';
import DashboardQuickAccess from '@/features/dashboard/components/DashboardQuickAccess';
import { theme } from '@/layout/globalStyles/theme';

const colors = theme.color;

export default function Home() {
  const { items, totals, loading, error, updatedAt, allowed, isLoading, refresh } = useDashboard();
  const firstLoad = isLoading || (allowed && !updatedAt && !error);

  return (
    <Box component="main" sx={{ background: colors.background, minHeight: 'calc(100vh - 120px)', color: colors.textPrimary, px: { xs: 2, sm: 3, md: 5 }, py: { xs: 3, md: 5 } }}>
      <Head><title>Dashboard | Visão geral</title></Head>
      <Box sx={{ maxWidth: 1240, mx: 'auto' }}>
        <DashboardHeader allowed={allowed} loading={loading} onRefresh={refresh} />

        {!isLoading && !allowed && (
          <Alert severity="info" sx={{ mb: 3, borderRadius: '12px' }}>
            Seu perfil não possui permissão para visualizar os indicadores do dashboard. Use os atalhos disponíveis abaixo.
          </Alert>
        )}
        {allowed && error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }} action={
            <Button color="inherit" disabled={loading} onClick={() => void refresh()}>Tentar novamente</Button>
          }>
            {error}{updatedAt && ' Os indicadores exibidos são da última consulta bem-sucedida.'}
          </Alert>
        )}

        {(allowed || isLoading) && (
          <Box aria-busy={loading}>
            <DashboardSummaryCards totals={totals} firstLoad={firstLoad} updatedAt={updatedAt} />
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' }, gap: 2.5 }}>
              <Box sx={{ gridColumn: { md: 'span 2' } }}>
                <DashboardCategories items={items} firstLoad={firstLoad} error={error} />
              </Box>
              <DashboardStatusDistribution totals={totals} firstLoad={firstLoad} updatedAt={updatedAt} />
            </Box>
            {updatedAt && (
              <Typography role="status" sx={{ mt: 2, textAlign: 'right', fontSize: 12, color: colors.textSecondary }}>
                Última atualização: {updatedAt.toLocaleString('pt-BR')}
              </Typography>
            )}
          </Box>
        )}
        <DashboardQuickAccess />
      </Box>
    </Box>
  );
}
