import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ArticleIcon from "@mui/icons-material/Article";
import useDrawer from "./useDrawer";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { theme } from "@/layout/globalStyles/theme";
import { appConfig } from "@/config/appConfig";

export default function DrawerComponent() {
    const { data: session } = useSession();

    const {
        action: {
            toggleDrawer,
        },
        data: {
            open,
            menuList,
        },
    } = useDrawer();

    if (!session) return null;

    const DrawerList = (
        <Box
            role="presentation"
            onClick={toggleDrawer(false)}
            sx={{
                width: theme.layout.sidebarWidth,
                height: "100%",
                backgroundColor: theme.color.primary,
                color: theme.color.white,
                display: "flex",
                flexDirection: "column",
                px: 1.5,
            }}
        >
            {/* Nome do sistema */}
            <Box
                sx={{
                    px: 2,
                    pt: 3,
                    pb: 2.5,
                }}
            >
                <Box
                    component="h2"
                    sx={{
                        m: 0,
                        fontSize: "1.25rem",
                        fontWeight: 700,
                        color: theme.color.white,
                        lineHeight: 1.2,
                    }}
                >
                    {appConfig.nomeSistema}
                </Box>
            </Box>

            <Divider
                sx={{
                    borderColor: "rgba(255,255,255,0.12)",
                    mb: 1.5,
                }}
            />

            {/* Menu */}
            <List
                sx={{
                    px: 0.5,
                    py: 0,
                }}
            >
                {menuList.map((item, index) => (
                    <Link
                        key={index}
                        href={item.href || ""}
                        style={{
                            textDecoration: "none",
                            color: "inherit",
                        }}
                    >
                        <ListItem disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                sx={{
                                    minHeight: 46,
                                    px: 1.5,
                                    borderRadius: theme.radius.md,

                                    "&:hover": {
                                        backgroundColor: "rgba(255,255,255,0.10)",
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 40,
                                        color: theme.color.white,
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>

                                <ListItemText
                                    primary={item.text}
                                    sx={{
                                        color: theme.color.white,
                                        fontSize: "0.95rem",
                                        fontWeight: 500,
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    </Link>
                ))}
            </List>
        </Box>
    );

    return (
        <>
            <Button
                onClick={toggleDrawer(true)}
                sx={{
                    minWidth: 44,
                    width: 44,
                    height: 44,
                    borderRadius: theme.radius.md,
                    color: theme.color.white,

                    "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.08)",
                    },
                }}
            >
                <ArticleIcon
                    sx={{
                        color: theme.color.white,
                        opacity: 0.9,
                    }}
                />
            </Button>

            <Drawer
                open={open}
                onClose={toggleDrawer(false)}
                sx={{
                    width: theme.layout.sidebarWidth,
                    backgroundColor: theme.color.primary,
                    borderRight: "none",
                    boxShadow: theme.shadow.lg,
                }}
            >
                {DrawerList}
            </Drawer>
        </>
    );
}
