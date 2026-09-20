import { describe, expect, it } from 'vitest';

import {
  calculateAccessTokenExpiresAt,
  getSafeCallbackUrl,
  isAccessTokenExpired,
} from './session';

describe('session helpers', () => {
  it('calcula e valida a expiração do token da API', () => {
    expect(calculateAccessTokenExpiresAt(60_000, 1_000)).toBe(61_000);
    expect(calculateAccessTokenExpiresAt(0, 1_000)).toBeNull();
    expect(isAccessTokenExpired(61_000, 60_999)).toBe(false);
    expect(isAccessTokenExpired(61_000, 61_000)).toBe(true);
    expect(isAccessTokenExpired(undefined, 1_000)).toBe(true);
  });

  it('aceita somente destinos internos após o login', () => {
    expect(getSafeCallbackUrl('/perfil?id=1')).toBe('/perfil?id=1');
    expect(getSafeCallbackUrl(['/usuario', '/perfil'])).toBe('/usuario');
    expect(getSafeCallbackUrl('https://example.com')).toBe('/');
    expect(getSafeCallbackUrl('//example.com')).toBe('/');
  });
});
