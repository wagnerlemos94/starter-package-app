import { describe, expect, it } from 'vitest';
import { perfilFormDefaultValues, perfilFormSchema } from './perfilSchema';

const recursoId = '00000000-0000-4000-8000-000000000001';
const permissaoId = '00000000-0000-4000-8000-000000000002';
const perfil = { ...perfilFormDefaultValues, nome: 'gestão', descricao: 'Gestores' };

describe('validação do perfil', () => {
  it.each([{ perfilRecurso: [] }, { perfilRecurso: [{ recursoId, permissaoIds: [] }] }])(
    'impede salvar sem nenhuma permissão: %j',
    ({ perfilRecurso }) => {
      const result = perfilFormSchema.safeParse({ ...perfil, perfilRecurso });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toContainEqual(expect.objectContaining({
          path: ['perfilRecurso'],
          message: 'Inclua pelo menos uma permissão para salvar o perfil',
        }));
      }
    },
  );

  it('aceita uma permissão mesmo com outros recursos vazios e normaliza o nome', () => {
    const result = perfilFormSchema.parse({
      ...perfil,
      nome: ' gestão ',
      perfilRecurso: [
        { recursoId, permissaoIds: [] },
        { recursoId: permissaoId, permissaoIds: [permissaoId] },
      ],
    });
    expect(result.nome).toBe('GESTÃO');
  });
});
