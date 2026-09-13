import { Resource } from "@/auth/resources";
import { TableContainer } from "@mui/material";

export type DataTableProps<T> = {
    resource: Resource;
    columns: Array<{
        key: string | keyof T;
        label: string;
        render?: (value: unknown, row: T) => React.ReactNode;
    }>;
    data: T[];
    className?: string;
    titulo?: string;
    buttonCadastro?: {
        nome: string;
        onChange?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
        icon?: React.ReactNode;
        redirect?: string;
    };
    loading?: boolean;
    getRowKey?: (row: T, index: number) => React.Key;
    action?: {
        edit?: {
            onChange: (t: T) => void;
            disabled?: (t: T) => boolean;
        }
        delete?: {
            onChange: (t: T) => void;
            confirmDelete?: boolean | {
                title?: string;
                description?: (row: T) => React.ReactNode;
                confirmText?: string;
                cancelText?: string;
            },
            disabled?: (t: T) => boolean;
        }
        status?: {
            onChange: (t: T) => void;
            checked: (t: T) => boolean;
            disabled?: (t: T) => boolean;
        }
    }
    containerProps?: React.ComponentProps<typeof TableContainer>;
};
