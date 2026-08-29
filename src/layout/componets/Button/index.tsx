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
        backgroundColor = "primary",
        color = "white",
        type = "button"

    }: BotaoProps) {
    return (
        <B
            sx={{
                backgroundColor: theme.color[backgroundColor],
                color: theme.color[color],
                borderRadius: 2,
                marginRight: 1,
                padding: icon ? "6px" : "4px",
                paddingRight: icon ? "21px" : "10px",
                paddingLeft: "11px",
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