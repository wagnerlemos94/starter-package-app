import React, { Fragment } from 'react';
import Button from "@/layout/components/Button";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

export interface IModalProps {
    titulo: string;
    children: React.ReactNode;
    open: boolean;
    setOpen: (value: boolean) => void;
    buttonAcao?: () => void;
}

export default function Modal({ titulo, children, open, setOpen, buttonAcao }: IModalProps) {
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                role="dialog"
                fullWidth
                maxWidth="md"
                sx={{
                    borderRadius: 3,
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 20px 45px rgba(15, 23, 42, 0.14)',
                    maxHeight: '82vh',
                }}
            >
                <DialogTitle
                    id="alert-dialog-title"
                    sx={{
                        px: { xs: 2.5, md: 3.5 },
                        pt: 3,
                        pb: 2,
                        fontSize: '1.35rem',
                        fontWeight: 700,
                        color: '#111827',
                        borderBottom: '1px solid #EEF0F3',
                    }}
                >
                    {titulo}
                </DialogTitle>

                <DialogContent sx={{ px: { xs: 2.5, md: 3.5 }, py: 3 }}>
                    {children}
                </DialogContent>

                <DialogActions
                    sx={{
                        px: { xs: 2.5, md: 3.5 },
                        py: 2.5,
                        gap: 1,
                        borderTop: '1px solid #EEF0F3',
                    }}
                >
                    <Button
                        nome="Fechar"
                        onClick={handleClose}
                        sx={{ textTransform: 'none', fontWeight: 600 }}
                    />
                    {buttonAcao && (
                        <Button
                            onClick={buttonAcao}
                            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
                            nome="Ação"
                        />
                    )}
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}
