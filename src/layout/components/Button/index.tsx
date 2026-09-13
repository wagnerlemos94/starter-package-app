import { theme } from "@/layout/globalStyles/theme";
import { Button as B, ButtonBaseOwnProps } from "@mui/material";

interface BotaoProps extends ButtonBaseOwnProps {
    nome: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
    icon?: React.ReactNode;
    backgroundColor?: keyof typeof theme.color;
    color?: keyof typeof theme.color;
};

export default function Button(
    { nome,
        onClick,
        icon,
        backgroundColor = "primaryHover",
        color = "white",
        type = "button"

    }: BotaoProps) {
    return (
        <B
            sx={{
                backgroundColor: theme.color[backgroundColor],
                color: theme.color[color],
                borderRadius: 2,
                minHeight: 40,
                px: icon ? 2.25 : 2,
                py: 1,
                gap: 1,
                fontWeight: 600,
                textTransform: "none",
            }}
            key={nome}
            onClick={onClick}
            type={type}
        >
            {icon ?? <>{icon}</>}
            {nome}
        </B>
    );

}
