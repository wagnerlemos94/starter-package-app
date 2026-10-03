import { z } from 'zod';
import { isValidCPF } from '../utils/isValidCPF';

export const usuarioFormSchema = z.object({
  cpf: z
    .string()
    .min(1, 'CPF é obrigatório')
    .refine(isValidCPF, { message: 'CPF inválido' }),
  nome: z
    .string()
    .min(1, 'Nome é obrigatório')
    .max(120, 'Nome deve conter no máximo 120 caracteres'),
  perfilId: z.string().uuid('Perfil inválido'),
  senha: z
    .string()
    .max(72, 'Senha deve conter no máximo 72 caracteres')
    .refine((value) => value.length === 0 || value.length >= 8, {
      message: 'Senha deve conter pelo menos 8 caracteres',
    }),
  ativo: z.boolean(),
});

export type UsuarioFormSchema = z.infer<typeof usuarioFormSchema>;

export const usuarioFormDefaultValues: UsuarioFormSchema = {
  cpf: '',
  nome: '',
  perfilId: '',
  senha: '',
  ativo: true,
};

export const usuarioContaSchema = usuarioFormSchema.pick({ nome: true, senha: true })
  .extend({
    nome: z.string().trim().min(1, 'Nome é obrigatório').max(150, 'Nome deve conter no máximo 150 caracteres'),
    senha: usuarioFormSchema.shape.senha.refine((value) => value === '' || value.trim().length > 0, {
      message: 'Senha não pode conter apenas espaços',
    }),
    senhaAtual: z.string().max(72, 'Senha deve conter no máximo 72 caracteres'),
  })
  .superRefine((data, context) => {
    if (data.senha && !data.senhaAtual) {
      context.addIssue({ code: 'custom', path: ['senhaAtual'], message: 'Informe a senha atual para alterar a senha' });
    }
  });

export type UsuarioContaSchema = z.infer<typeof usuarioContaSchema>;

export const usuarioContaDefaultValues: UsuarioContaSchema = {
  nome: '',
  senha: '',
  senhaAtual: '',
};
