import { z } from "zod";
import { isValidCPF } from "@/utils/isValidCPF";

export const loginSchema = z.object({
  cpf: z.string()
  .min(1, "CPF é obrigatório")
  .refine(isValidCPF, { message: "CPF inválido" }),
  senha: z.string()
    .min(1, "Senha é obrigatória"), 
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const loginDefaultValues: LoginSchema = {
  cpf: "",
  senha: "",
};
