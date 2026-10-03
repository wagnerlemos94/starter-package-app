import Link from 'next/link';
import { Box, Typography } from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import { RESOURCE } from '@/auth/resources';
import { usePermission } from '@/auth/usePermission';
import { theme } from '@/layout/globalStyles/theme';
const colors = theme.color;


export default function DashboardQuickAccess() {
  const { hasPermission } = usePermission();
    const links = [
        { title: 'Usuários', description: 'Consulte e gerencie os cadastros.', href: '/usuario', resource: RESOURCE.USUARIO, icon: <PeopleAltOutlinedIcon /> },
        { title: 'Perfis de acesso', description: 'Organize os perfis e suas permissões.', href: '/perfil', resource: RESOURCE.PERFIL, icon: <AdminPanelSettingsOutlinedIcon /> },
        { title: 'Minha conta', description: 'Atualize seu nome e sua senha.', href: '/minha-conta', resource: null, icon: <ManageAccountsOutlinedIcon /> },
    ].filter((item) => !item.resource || hasPermission(item.resource, 'VIEW'));

  return (
<Box sx={{ mt: 4 }}><Typography component="h2" sx={{
        fontWeight: 750,
        fontSize: 20,
        mb: 2
    }}>Acesso rápido</Typography><Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0, 1fr))' }, gap: 2 }}>{links.map((item) => <Box component={Link} href={item.href} key={item.href} sx={{ display: 'flex', alignItems: 'center', gap: 2, bgcolor: colors.white, border: `1px solid ${colors.border}`, p: 2.5, borderRadius: '14px', transition: 'border-color 150ms', '&:hover': { borderColor: colors.primary }, '&:focus-visible': { outline: `3px solid ${colors.info}`, outlineOffset: 3 } }}><Box sx={{ color: colors.primary, display: 'flex' }}>{item.icon}</Box><Box sx={{ flex: 1 }}><Typography sx={{
        fontWeight: 700,
        fontSize: 14
    }}>{item.title}</Typography><Typography sx={{
        fontSize: 12,
        color: colors.textSecondary,
        mt: 0.5
    }}>{item.description}</Typography></Box><ArrowForwardRoundedIcon sx={{ fontSize: 18, color: colors.textMuted }}/></Box>)}</Box></Box>
  );
}
