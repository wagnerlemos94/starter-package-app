import { useState } from "react";
import { DataTableProps } from "./types";
import { usePermission } from "@/auth/usePermission";

interface propsUseDataTable<T> {
    action?: {
        edit?: {
            onChange: (t: T) => void;
        }
        delete?: {
            onChange: (t: T) => void;
            confirmDelete?: boolean | {
                title?: string;
                description?: (row: T) => React.ReactNode;
                confirmText?: string;
                cancelText?: string;
            }
        }
        status?: {
            onChange: (t: T) => void;
            checked: (t: T) => boolean;
        }
    }
}

export const useDataTable = <T extends object>({
    action
}: propsUseDataTable<T>) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(3);
    const { hasPermission } = usePermission();

    const [confirmOpenDelete, setConfirmOpenDelete] = useState(false);
    const [confirmOpenStatus, setConfirmOpenStatus] = useState(false);
    const [selectedRow, setSelectedRow] = useState<T | null>(null);

    const handleInativarClick = (row: T) => {
        const confirmSetting = action?.status?.checked;
        if (confirmSetting) {
            setSelectedRow(row);
            setConfirmOpenStatus(true);
            return;
        }
        action?.status?.onChange(row);
    }

    const handleDeleteClick = (row: T) => {
        const confirmSetting = action?.delete?.confirmDelete;
        if (confirmSetting) {
            setSelectedRow(row);
            setConfirmOpenDelete(true);
            return;
        }
        action?.delete?.onChange(row);
    }

    const handleConfirmDelete = () => {
        if (selectedRow) {
            action?.delete?.onChange(selectedRow);
            setSelectedRow(null);
        }
        setConfirmOpenDelete(false);
    }
    const handleConfirmStatus = () => {
        if (selectedRow) {
            console.log('selectedRow', selectedRow);
            action?.status?.onChange(selectedRow);
            setSelectedRow(null);
        }
        setConfirmOpenStatus(false);
    }

    const modalTitle = typeof action?.delete?.confirmDelete === 'object' && action!.delete!.confirmDelete!.title ? action!.delete!.confirmDelete!.title : 'Confirmar exclusão';
    const modalConfirmText = typeof action?.delete?.confirmDelete === 'object' && action!.delete!.confirmDelete!.confirmText ? action!.delete!.confirmDelete!.confirmText : 'Excluir';
    const modalCancelText = typeof action?.delete?.confirmDelete === 'object' && action!.delete!.confirmDelete!.cancelText ? action!.delete!.confirmDelete!.cancelText : 'Cancelar';
    return {
        action: {
            handleDeleteClick,
            handleConfirmDelete,
            setConfirmOpenDelete,
            setConfirmOpenStatus,
            handleConfirmStatus,
            setRowsPerPage,
            setPage,
            handleInativarClick,
            hasPermission,
        },
        data: {
            modalCancelText,
            modalConfirmText,
            modalTitle,
            confirmOpenDelete,
            confirmOpenStatus,
            rowsPerPage,
            page,
        }
    }
}