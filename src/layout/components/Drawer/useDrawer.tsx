import { useState } from "react";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
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
      text: "Inbox",
      icon: <InboxIcon />,
      href: "/exemplo",
    },
    {
      text: "Usuário",
      icon: <MailIcon />,
      href: "/usuario",
      resource: RESOURCE.USUARIO,
    },
    {
      text: "Perfil",
      icon: <InboxIcon />,
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
