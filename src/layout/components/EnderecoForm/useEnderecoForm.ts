import { useState } from "react";
import { UseFormSetValue } from "react-hook-form";

interface IUseEnderecoForm<TFieldValues extends Record<string, any> = Record<string, any>> {
    setValue?: UseFormSetValue<TFieldValues>;
    namePrefix?: string;
}

export interface Endereco {
    logradouro: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
    cep?: string;
}

export const useEnderecoForm = <
    TFieldValues extends Record<string, any> = Record<string, any>
>(
    {
        setValue,
        namePrefix

    }: IUseEnderecoForm<TFieldValues>
) => {

    const UFS = [
        'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO'
    ];

    const buscarViaCep = async (cepRaw?: unknown) => {
        const cep = String(cepRaw ?? '').replace(/\D/g, '');
        if (!cep || cep.length !== 8 || !setValue) return;
        try {
            setCepLoading(true);
            const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await res.json();
            if (data && !data.erro) {
                setValue?.(`${namePrefix}.logradouro` as any, data.logradouro || '');
                setValue?.(`${namePrefix}.complemento` as any, data.complemento || '');
                setValue?.(`${namePrefix}.bairro` as any, data.bairro || '');
                setValue?.(`${namePrefix}.cidade` as any, data.localidade || '');
                setValue?.(`${namePrefix}.estado` as any, data.uf || '');
            }
        } catch {
            return;
        } finally {
            setCepLoading(false);
        }
    }
    const [cepLoading, setCepLoading] = useState(false);

    return {
        action: {
            buscarViaCep,
        },
        data: {
            cepLoading,
            UFS
        }
    }
}
