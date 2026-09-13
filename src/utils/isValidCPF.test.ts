import { describe, expect, it } from 'vitest';

import { isValidCPF } from './isValidCPF';

describe('isValidCPF', () => {
  it('aceita CPF válido com ou sem máscara', () => {
    expect(isValidCPF('52998224725')).toBe(true);
    expect(isValidCPF('529.982.247-25')).toBe(true);
  });

  it('rejeita CPF inválido', () => {
    expect(isValidCPF('11111111111')).toBe(false);
    expect(isValidCPF('52998224724')).toBe(false);
  });
});
