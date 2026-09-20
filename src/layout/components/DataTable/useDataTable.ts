import { useState } from "react";
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
    const [rowsPerPage, setRowsPerPage] = useState(10);
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
            action?.status?.onChange(selectedRow);
            setSelectedRow(null);
        }
        setConfirmOpenStatus(false);
    }

    const deleteConfirmation = typeof action?.delete?.confirmDelete === 'object'
        ? action.delete.confirmDelete
        : undefined;
    const modalTitle = deleteConfirmation?.title ?? 'Confirmar exclusão';
    const modalDescription = selectedRow && deleteConfirmation?.description
        ? deleteConfirmation.description(selectedRow)
        : 'Deseja realmente excluir este item?';
    const modalConfirmText = deleteConfirmation?.confirmText ?? 'Excluir';
    const modalCancelText = deleteConfirmation?.cancelText ?? 'Cancelar';
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
            modalDescription,
            confirmOpenDelete,
            confirmOpenStatus,
            rowsPerPage,
            page,
        }
    }
}
