import { useToast } from "@/components/Toast";
import { apiGet } from "@/services/api";
import router from "next/router";
import { useEffect, useState } from "react";

export interface IExemplo {
    id: number;
    website: string;
    name: string;
    age: number;
    email: string;
    address: string;
    phone: string;
    ativo: boolean;
}

const useExemplo = () => {

    const [list, setList] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const { showToast } = useToast();
    const columns =
        [
            { key: "name", label: "Name" },
            { key: "age", label: "Age" },
            { key: "email", label: "Email" },
            { key: "address", label: "Address" },
            { key: "phone", label: "Phone" },
        ]

    useEffect(() => {
        buscarLista();
    }, []);

    /**
     * 
     * @param t 
     * Logica para ir na API fazer a ação de deletar
     */
    const del = (t: IExemplo) => {
        console.log("delete", t)
    }

    /**
    * 
    * @param t 
    * Logica para ir na API fazer a ação de editar
    */
    const edit = (t: IExemplo) => {
        console.log("edit", t)
        router.push({
            pathname: `/exemplo/form`,
            query: { id: t.id }
        });
    }

    /**
    * @param t 
    * Logica para ir na API fazer a ação de mudar o status, no exemplo estou apenas invertendo o valor de ativo para simular a mudança de status
    */
    const status = (t: IExemplo) => {
        console.log("status", t)
        setList(prev => prev.map(item => {
            if (item.id === t.id) {
                return {
                    ...item,
                    ativo: !item.ativo
                }
            }
            return item;
        }));
    }

    const buscarLista = async () => {
        setLoading(true);
        try {
            const result = await apiGet<any[]>("https://jsonplaceholder.typicode.com/users");
            if (!result.success) {
                showToast(result.message || 'Erro ao carregar os dados!', 'error');
                setList([]);
                console.log('Erro na API:', result);
                return;
            }
            const response = result.data;
            const newResponse = response.map((item: any) => {
                return {
                    ...item,
                    ativo: item.ativo || false
                }
            })
            setList(newResponse);
            console.log(newResponse);
        } catch (error) {
            showToast("Erro ao carregar os dados!", "error");
            console.log(error)
            setList([])
        } finally {
            setLoading(false);
        }

    }

    return {
        action: {
            del,
            status,
            edit
        },
        data: {
            list,
            columns,
            loading
        }
    }
}

export default useExemplo;