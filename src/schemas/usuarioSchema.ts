import { z } from 'zod';
import { isValidCPF } from '../utils/isValidCPF';

export const usuarioFormSchema = z.object({
  cpf: z
    .string()
    .min(1, 'CPF é obrigatório')
    .refine(isValidCPF, { message: 'CPF inválido' }),
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .max(120, 'Nome deve conter no máximo 120 caracteres'),
  profileId: z.string().uuid('Perfil inválido'),
  password: z
    .string()
    .max(72, 'Senha deve conter no máximo 72 caracteres')
    .refine((value) => value.length === 0 || value.length >= 8, {
      message: 'Senha deve conter pelo menos 8 caracteres',
    }),
  active: z.boolean(),
});

export type UsuarioFormSchema = z.infer<typeof usuarioFormSchema>;

export const usuarioFormDefaultValues: UsuarioFormSchema = {
  cpf: '',
  name: '',
  profileId: '',
  password: '',
  active: true,
};

export const usuarioContaSchema = usuarioFormSchema.pick({ name: true, password: true })
  .extend({
    name: z.string().trim().min(1, 'Nome é obrigatório').max(150, 'Nome deve conter no máximo 150 caracteres'),
    password: usuarioFormSchema.shape.password.refine((value) => value === '' || value.trim().length > 0, {
      message: 'Senha não pode conter apenas espaços',
    }),
    currentPassword: z.string().max(72, 'Senha deve conter no máximo 72 caracteres'),
  })
  .superRefine((data, context) => {
    if (data.password && !data.currentPassword) {
      context.addIssue({ code: 'custom', path: ['currentPassword'], message: 'Informe a senha atual para alterar a senha' });
    }
  });

export type UsuarioContaSchema = z.infer<typeof usuarioContaSchema>;

export const usuarioContaDefaultValues: UsuarioContaSchema = {
  name: '',
  password: '',
  currentPassword: '',
};
