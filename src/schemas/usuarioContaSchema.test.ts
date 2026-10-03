import { describe, expect, it } from 'vitest';
import { usuarioContaSchema, usuarioContaDefaultValues } from './usuarioSchema';

describe('edição da própria conta', () => {
  it('permite alterar o nome sem trocar a senha', () => {
    expect(usuarioContaSchema.safeParse({ ...usuarioContaDefaultValues, nome: 'Maria' }).success).toBe(true);
  });

  it('exige senha atual ao trocar a senha', () => {
    const result = usuarioContaSchema.safeParse({ ...usuarioContaDefaultValues, nome: 'Maria', senha: 'nova-senha' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues.some((issue) => issue.path[0] === 'senhaAtual')).toBe(true);
  });

  it('rejeita nome em branco e normaliza espaços nas extremidades', () => {
    expect(usuarioContaSchema.safeParse({ ...usuarioContaDefaultValues, nome: '   ' }).success).toBe(false);
    expect(usuarioContaSchema.parse({ ...usuarioContaDefaultValues, nome: ' Maria ' }).nome).toBe('Maria');
  });

  it('valida o tamanho da nova senha', () => {
    expect(usuarioContaSchema.safeParse({ nome: 'Maria', senha: 'curta', senhaAtual: 'senha-atual' }).success).toBe(false);
    expect(usuarioContaSchema.safeParse({ nome: 'Maria', senha: 'nova-senha', senhaAtual: 'senha-atual' }).success).toBe(true);
  });

  it('rejeita uma nova senha composta apenas por espaços', () => {
    expect(usuarioContaSchema.safeParse({ nome: 'Maria', senha: '        ', senhaAtual: 'senha-atual' }).success).toBe(false);
  });
});
