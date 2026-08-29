import { z } from "zod";
import { isValidCPF } from "@/utils/isValidCPF";
import { enderecoDefaultValues, enderecoSchema } from "./enderecoSchema";
import { contatoSchema } from "./contatoSchema";

export const exemploFormSchema = z.object({
  nome: z.string()
    .min(1, "Nome é obrigatório")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  nascimento: z.date().optional()
    .refine((val) => val !== undefined && val !== null, {
      message: "Nascimento é obrigatório",
    })
    .refine(
      (val) => {
        if (!val) return true;
        const today = new Date();
        today.setHours(0,0,0,0);
        return val <= today;
      },
      {
        message: "Nascimento deve ser uma data válida e não pode ser maior que hoje",
      }
    ),
  cpf: z.string()
    .min(1, "CPF é obrigatório")
    .refine(isValidCPF, { message: "CPF inválido" }),
  rg: z.string()
    .min(1, "RG é obrigatório")
    .max(10, "RG deve ter no máximo 10 caracteres"),
  responsavel: z.string()
    .min(1, "Responsável é obrigatório"),
  endereco: enderecoSchema,
  contato: z.array(contatoSchema),
});

export type ExemploFormSchema = z.infer<typeof exemploFormSchema>;

export const exemploFormDefaultValues: ExemploFormSchema = {
  nome: "",
  cpf: "",
  rg: "",
  responsavel: "",
  endereco: enderecoDefaultValues,
  contato: [],
};
