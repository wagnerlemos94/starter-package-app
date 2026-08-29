import { z } from 'zod';

export const perfilFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .max(120, 'Nome deve conter no máximo 120 caracteres'),
  description: z
    .string()
    .min(1, 'Descrição é obrigatória')
    .max(255, 'Descrição deve conter no máximo 255 caracteres'),
  active: z.boolean(),
  profilesResource: z.array(
    z.object({
      resourceId: z.string().uuid('Recurso inválido'),
      permissionIds: z.array(z.string().uuid('Permissão inválida')),
    })
  ),
});

export type PerfilFormSchema = z.infer<typeof perfilFormSchema>;

export const perfilFormDefaultValues: PerfilFormSchema = {
  name: '',
  description: '',
  active: true,
  profilesResource: [],
};
