import { z } from "zod";

export const enderecoSchema = z.object({
	cep: z.string()
		.min(1, "CEP é obrigatório")
		.regex(/^\d{5}-?\d{3}$/, "CEP inválido (formato: 00000-000 ou 00000000)"),
	logradouro: z.string().min(1, "Rua é obrigatória").max(200, "Rua muito longa"),
	numero: z.string().min(1, "Número é obrigatório").max(10, "Número muito longo"),
	complemento: z.string().optional(),
	bairro: z.string().min(1, "Bairro é obrigatório").max(100, "Bairro muito longo"),
	cidade: z.string().min(1, "Cidade é obrigatória").max(100, "Cidade muito longa"),
	estado: z.string()
		.min(2, "Estado é obrigatório")
		.max(2, "Estado deve ser a sigla (2 letras)")
		.regex(/^[A-Za-z]{2}$/, "Estado inválido (use a sigla, ex: SP)"),
});

export type EnderecoSchema = z.infer<typeof enderecoSchema>;

export const enderecoDefaultValues: EnderecoSchema = {
	cep: "",
	logradouro: "",
	numero: "",
	complemento: "",
	bairro: "",
	cidade: "",
	estado: "",
};

