import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ArticleIcon from '@mui/icons-material/Article';
import useDrawer from './useDrawer';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { theme } from '@/layout/globalStyles/theme';
import { appConfig } from '@/constrants';

export default function DrawerComponet() {

    const { data: session } = useSession();

    const {
        action: {
            toggleDrawer
        },
        data: {
            open,
            menuList
        }
    } = useDrawer();

    if (!session) return null;

    const DrawerList = (
        <Box sx={{ width: 250, backgroundColor: theme.color.primary, height: '100%' }} role="presentation" onClick={toggleDrawer(false)}>
            <h2 style={{ textAlign: 'center', padding: '16px', color: theme.color.white }}>{appConfig.nomeSistema}</h2>
            <Divider />
            <List>
                {menuList.map((item, index) => (
                    <Link key={index} href={item.href || ""} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <ListItem key={item.text} disablePadding>
                            <ListItemButton>
                                <ListItemIcon sx={{ color: theme.color.white }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.text} sx={{ color: theme.color.white }} />
                            </ListItemButton>
                        </ListItem>
                    </Link>
                ))}
            </List>
        </Box>
    );
    return (
        <div>
            <Button onClick={toggleDrawer(true)}><ArticleIcon sx={{ color: '#ffffffcc' }} fontSize='large' /></Button>
            <Drawer open={open} onClose={toggleDrawer(false)}>
                {DrawerList}
            </Drawer>
        </div>
    );
}