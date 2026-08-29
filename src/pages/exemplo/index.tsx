import React from 'react';
import DataTable from "@/layout/componets/DataTable";
import useExemplo, { IExemplo } from "./useExemplo";
import AddIcon from '@mui/icons-material/Add';

export default function Exemplo() {
    const {
        action: {
            del,
            status,
            edit
        },
        data: {
            list,
            columns,
            loading,
        }
    } = useExemplo();

    return (
        <>
            <DataTable<IExemplo>
                titulo="Lista de exemplo"
                columns={columns}
                data={list}
                loading={loading}
                buttonList={[
                    {
                        nome: "novo",
                        icon: <AddIcon sx={{ marginRight: 1 }} />,
                        redirect: "/exemplo/form"
                    },                    
                ]}
                action={{
                    edit: {
                        onChange: (t: IExemplo) => edit(t)
                    },
                    status: {
                        onChange: (t: IExemplo) => status(t),
                        checked: (t: IExemplo) => t.ativo,
                        disabled: (t: IExemplo) => t.ativo
                    },
                    delete: {
                        onChange: (t: IExemplo) => del(t),
                        confirmDelete: true
                    },
                }}
                
            />
        </>
    )
}