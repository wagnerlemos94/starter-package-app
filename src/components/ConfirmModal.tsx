import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface ConfirmModalProps {
    open: boolean;
    setOpen: (v: boolean) => void;
    title?: string;
    description?: React.ReactNode;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
}

export default function ConfirmModal({
    open,
    setOpen,
    title = 'Confirmação',
    description,
    onConfirm,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar'
}: ConfirmModalProps) {
    const handleClose = () => setOpen(false);
    const handleConfirm = () => {
        onConfirm();
        setOpen(false);
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-description"
            role="alertdialog"
        >
            <DialogTitle id="confirm-dialog-title" sx={{ fontSize: '1.25rem', fontWeight: 600 }}>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="confirm-dialog-description">
                    {description}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>{cancelText}</Button>
                <Button color="error" onClick={handleConfirm} autoFocus>{confirmText}</Button>
            </DialogActions>
        </Dialog>
    )
}
