import { describe, expect, it } from 'vitest';
import { usuarioContaSchema, usuarioContaDefaultValues } from './usuarioSchema';

describe('edição da própria conta', () => {
  it('permite alterar o nome sem trocar a senha', () => {
    expect(usuarioContaSchema.safeParse({ ...usuarioContaDefaultValues, name: 'Maria' }).success).toBe(true);
  });

  it('exige senha atual ao trocar a senha', () => {
    const result = usuarioContaSchema.safeParse({ ...usuarioContaDefaultValues, name: 'Maria', password: 'nova-senha' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues.some((issue) => issue.path[0] === 'currentPassword')).toBe(true);
  });

  it('rejeita nome em branco e normaliza espaços nas extremidades', () => {
    expect(usuarioContaSchema.safeParse({ ...usuarioContaDefaultValues, name: '   ' }).success).toBe(false);
    expect(usuarioContaSchema.parse({ ...usuarioContaDefaultValues, name: ' Maria ' }).name).toBe('Maria');
  });

  it('valida o tamanho da nova senha', () => {
    expect(usuarioContaSchema.safeParse({ name: 'Maria', password: 'curta', currentPassword: 'senha-atual' }).success).toBe(false);
    expect(usuarioContaSchema.safeParse({ name: 'Maria', password: 'nova-senha', currentPassword: 'senha-atual' }).success).toBe(true);
  });

  it('rejeita uma nova senha composta apenas por espaços', () => {
    expect(usuarioContaSchema.safeParse({ name: 'Maria', password: '        ', currentPassword: 'senha-atual' }).success).toBe(false);
  });
});
