import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { exemploFormSchema, exemploFormDefaultValues, ExemploFormSchema } from "../../../schemas/exemploSchema";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { apiGet } from "@/services/api";
import { useToast } from "@/components/Toast";
import { IExemplo } from "../useExemplo";
import { useApiExemplo } from '@/hooks/api';


export default function useFormExempo() {
    const {
        handleSubmit,
        register,
        control,
        setValue,
        formState: { errors },
    } = useForm<ExemploFormSchema>({
        resolver: zodResolver(exemploFormSchema),
        defaultValues: exemploFormDefaultValues,
        mode: "onChange", // ou "onBlur" dependendo da sua necessidade
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const { showToast } = useToast();
    const [open, setOpen] = useState(false);
    const { query } = useRouter();
    const [optionsResponsavel, setOptionsResponsavel] = useState<Array<{ label: string; value: string }>>([]);

    const buscarResponsaveis = async () => {
        // Simulação de busca de responsáveis (pode ser substituída por uma chamada real à API)
        // Exemplo:
        // const response = await apiGet('/api/responsaveis');
        // setOptionsResponsavel(response.data);
        setOptionsResponsavel([
            { label: "Responsável 1", value: "1" },
            { label: "Responsável 2", value: "2" },
            { label: "Responsável 3", value: "3" },
        ]);
    }
    // const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (query.id) {
            console.log("ID do exemplo para edição:", query.id);
            buscar(String(query.id));
        }
    }, [query.id]);


    // Função para garantir que nascimento seja Date
    const parseNascimento = (data: ExemploFormSchema) => {
        return {
            ...data,
            nascimento: data.nascimento
                ? (data.nascimento instanceof Date
                    ? data.nascimento
                    : new Date(data.nascimento))
                : undefined,
        };
    };



    const { getById, create, update } = useApiExemplo();

    const buscar = async (id: string) => {
        setLoading(true);
        try {
            const result = await getById<IExemplo>(id);
            if (!result || !result.success || !result.data) {
                showToast(result?.message || 'Erro ao carregar os dados!', 'error');
                console.log('Erro na API:', result);
                return;
            }
            const response = result.data;
            setValue("nome", (response as any).name || response.nome || '');
            console.log(response);
        } catch (error) {
            showToast("Erro ao carregar os dados!", "error");
            console.log(error)
        } finally {
            setLoading(false);
        }

    }

    useEffect(() => {
        buscarResponsaveis();
        if (query.id) {
            // Aqui você pode fazer uma chamada para a API para buscar os dados do exemplo com base no ID e preencher o formulário
            console.log("ID do exemplo para edição:", query.id);
            buscar(Number(query.id));
        }
    }, [query.id]);

    const salvar = async (data: ExemploFormSchema) => {
        console.log("Dados do formulário antes do parse:", data);
        setIsSubmitting(true);
        try {
            const parsedData = parseNascimento(data);
            console.log("Dados do formulário:", parsedData);
            // exemplo: criar via API. useApiExemplo já exibe toasts
            await create(parsedData);
        } catch (error) {
            console.error("Erro ao salvar formulário:", error);
            showToast("Erro ao salvar formulário. Tente novamente.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        action: {
            salvar: handleSubmit(salvar, () => console.log("Erros de validação:", errors)),
            setOpen
        },
        data: {
            register,
            errors,
            control,
            loading,
            isSubmitting,
            open,
            optionsResponsavel,
            setValue,
        }
    }
}