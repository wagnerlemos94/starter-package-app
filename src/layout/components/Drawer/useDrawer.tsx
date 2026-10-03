import { useState } from "react";
import ScienceOutlinedIcon from "@mui/icons-material/ScienceOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import { RESOURCE } from "../../../auth/resources";
import { usePermission } from "@/auth/usePermission";

export interface DrawerComponentProps {
  menuList: Array<{
    text: string;
    icon: React.ReactNode;
    href?: string;
    resource?: typeof RESOURCE[keyof typeof RESOURCE];
  }>;
}

export default function Drawer() {
  const [open, setOpen] = useState(false);
  const { hasPermission } = usePermission();

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const menuList: DrawerComponentProps["menuList"] = [
    {
      text: "Dashboard",
      icon: <DashboardOutlinedIcon />,
      href: "/",
      resource: RESOURCE.DASHBOARD,
    },
    {
      text: "Exemplos",
      icon: <ScienceOutlinedIcon />,
      href: "/exemplo",
    },
    {
      text: "Usuários",
      icon: <PeopleAltOutlinedIcon />,
      href: "/usuario",
      resource: RESOURCE.USUARIO,
    },
    {
      text: "Perfis",
      icon: <AdminPanelSettingsOutlinedIcon />,
      href: "/perfil",
      resource: RESOURCE.PERFIL,
    },
  ];


  const authorizedMenuList = menuList.filter((item) => {
    if (!item.resource) {
      return true;
    }
    return hasPermission(item.resource, "VIEW");
  });

  return {
    action: {
      toggleDrawer,
    },
    data: {
      open,
      menuList: authorizedMenuList,
    },
  };
}
