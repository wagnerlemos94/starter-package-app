import { describe, expect, it } from 'vitest';

import { findRoutePermission, resolvePermission } from './route-permissions';

describe('route permissions', () => {
  it('seleciona a rota mais específica', () => {
    expect(findRoutePermission('/usuario/formUsuario')?.type).toBe('FORM');
    expect(findRoutePermission('/usuario')?.type).toBe('VIEW');
  });

  it('resolve criação e atualização pelo identificador', () => {
    const route = findRoutePermission('/usuario/formUsuario');
    expect(route).toBeDefined();
    expect(resolvePermission(route!, new URLSearchParams())).toBe('CREATE');
    expect(resolvePermission(route!, new URLSearchParams('id=123'))).toBe('UPDATE');
  });
});
