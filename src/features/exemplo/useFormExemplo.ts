import { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useToast } from "@/components/Toast";
import { useApiExemplo } from "@/hooks/api";
import {
    exemploFormDefaultValues,
    exemploFormSchema,
    ExemploFormSchema,
} from "@/schemas/exemploSchema";

export default function useFormExemplo() {
    const router = useRouter();
    const { query } = router;
    const { showToast } = useToast();
    const { create, update } = useApiExemplo();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        handleSubmit,
        register,
        control,
        setValue,
        formState: { errors },
    } = useForm<ExemploFormSchema>({
        resolver: zodResolver(exemploFormSchema),
        defaultValues: exemploFormDefaultValues,
        mode: "onChange",
    });

    const optionsResponsavel = [
        { label: "Responsável 1", value: "1" },
        { label: "Responsável 2", value: "2" },
        { label: "Responsável 3", value: "3" },
    ];

    const salvar = async (data: ExemploFormSchema) => {
        setIsSubmitting(true);
        try {
            const payload = {
                ...data,
                nascimento: data.nascimento instanceof Date
                    ? data.nascimento.toISOString()
                    : data.nascimento,
            };

            const result = query.id
                ? await update(String(query.id), payload)
                : await create(payload);

            if (result.success) {
                await router.push('/exemplo');
            }
        } catch {
            showToast("Erro ao salvar formulário. Tente novamente.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        action: {
            salvar: handleSubmit(salvar),
        },
        data: {
            register,
            errors,
            control,
            loading: false,
            isSubmitting,
            optionsResponsavel,
            setValue,
        },
    };
}
