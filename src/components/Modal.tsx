import React, { Children, Fragment, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
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
            {/* <Button variant="outlined" onClick={handleClickOpen}>
                Open alert dialog
            </Button> */}
            <Dialog
                open={open}
                // onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                role="alertdialog"
                sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435, height: '50%' } }} 
            >
                <DialogTitle id="alert-dialog-title" sx={{ fontSize: '1.5rem', fontWeight: 'bold' , textAlign: 'center' }}>
                    {titulo}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {children}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} autoFocus>
                        fechar
                    </Button>
                    {
                        buttonAcao && (
                            <Button onClick={buttonAcao}>
                                ação
                            </Button>
                        )
                    }
                </DialogActions>
            </Dialog>
        </Fragment>
    );
} 