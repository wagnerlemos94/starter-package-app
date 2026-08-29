import { z } from "zod";

export const contatoSchema = z.object({
	tipo: z.string().min(1, "Tipo é obrigatório"),
	contato: z.string()
		.min(1, "Contato é obrigatório")
		.max(100, "Contato deve ter no máximo 100 caracteres"),
});

export type ContatoSchema = z.infer<typeof contatoSchema>;

export const contatoDefaultValues: ContatoSchema = {
	tipo: "",
	contato: "",
};

