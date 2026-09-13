import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { useToast } from "@/components/Toast";
import { apiGet } from "@/services/api";

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

interface JsonPlaceholderUser {
    id: number;
    website: string;
    name: string;
    email: string;
    address: { city: string };
    phone: string;
}

export default function useExemplo() {
    const router = useRouter();
    const { showToast } = useToast();
    const [list, setList] = useState<IExemplo[]>([]);
    const [loading, setLoading] = useState(false);

    const columns = [
        { key: "name", label: "Nome" },
        { key: "email", label: "E-mail" },
        { key: "address", label: "Cidade" },
        { key: "phone", label: "Telefone" },
    ];

    const del = (item: IExemplo) => {
        setList((current) => current.filter(({ id }) => id !== item.id));
    };

    const edit = (item: IExemplo) => {
        void router.push({ pathname: "/exemplo/form", query: { id: item.id } });
    };

    const status = (item: IExemplo) => {
        setList((current) => current.map((currentItem) =>
            currentItem.id === item.id
                ? { ...currentItem, ativo: !currentItem.ativo }
                : currentItem
        ));
    };

    const buscarLista = async () => {
        setLoading(true);
        const result = await apiGet<JsonPlaceholderUser[]>(
            "https://jsonplaceholder.typicode.com/users"
        );

        if (result.success) {
            setList(result.data.map((item) => ({
                ...item,
                age: 0,
                address: item.address.city,
                ativo: true,
            })));
        } else {
            setList([]);
            showToast(result.message || "Erro ao carregar os dados!", "error");
        }
        setLoading(false);
    };

    useEffect(() => {
        void buscarLista();
        // A listagem de demonstração deve ser carregada uma vez na montagem.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        action: { del, status, edit },
        data: { list, columns, loading },
    };
}
