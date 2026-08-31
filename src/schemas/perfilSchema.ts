import { z } from 'zod';

export const perfilFormSchema = z.object({
  nome: z
    .string()
    .min(1, 'Nome é obrigatório')
    .max(120, 'Nome deve conter no máximo 120 caracteres'),
  descricao: z
    .string()
    .min(1, 'Descrição é obrigatória')
    .max(255, 'Descrição deve conter no máximo 255 caracteres'),
  ativo: z.boolean(),
  perfilRecurso: z.array(
    z.object({
      recursoId: z.string().uuid('Recurso inválido'),
      permissaoIds: z.array(z.string().uuid('Permissão inválida')),
    })
  ),
});

export type PerfilFormSchema = z.infer<typeof perfilFormSchema>;

export const perfilFormDefaultValues: PerfilFormSchema = {
  nome: '',
  descricao: '',
  ativo: true,
  perfilRecurso: [],
};
