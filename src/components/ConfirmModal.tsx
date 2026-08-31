import React from 'react';
import Button from "@/layout/componets/Button";
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
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="confirm-dialog-title"
            aria-describedby="confirm-dialog-description"
            role="alertdialog"
            fullWidth
            maxWidth="xs"
            sx={{
                borderRadius: 3,
                border: '1px solid #E5E7EB',
                boxShadow: '0 20px 45px rgba(15, 23, 42, 0.14)',
                overflow: 'hidden',
            }}
        >
            <DialogTitle
                id="confirm-dialog-title"
                sx={{
                    px: 3,
                    pt: 3,
                    pb: 1,
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#111827',
                }}
            >
                {title}
            </DialogTitle>

            <DialogContent sx={{ px: 3, py: 1.5 }}>
                <DialogContentText
                    id="confirm-dialog-description"
                    sx={{ color: '#6B7280', lineHeight: 1.6 }}
                >
                    {description}
                </DialogContentText>
            </DialogContent>

            <DialogActions sx={{ px: 3, pt: 1.5, pb: 3, gap: 1 }}>
                <Button
                    backgroundColor="buttonSecondary"
                    color="black"
                    nome={cancelText}
                    onClick={handleClose}
                    sx={{ textTransform: 'none', fontWeight: 600 }}
                >

                </Button>
                <Button
                    nome={confirmText}
                    onClick={handleConfirm}
                    sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
                    backgroundColor="danger"
                >
                </Button>
            </DialogActions>
        </Dialog>
    );
}
