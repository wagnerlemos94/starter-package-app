import { describe, expect, it } from 'vitest';

import { hasPermission, type ResourcePermissions } from './permissions';

describe('hasPermission', () => {
  const resources: ResourcePermissions = {
    USUARIO: ['VIEW', 'CREATE'],
  };

  it('autoriza uma permissão atribuída ao recurso', () => {
    expect(hasPermission(resources, 'USUARIO', 'VIEW')).toBe(true);
  });

  it('nega permissão ausente ou mapa indefinido', () => {
    expect(hasPermission(resources, 'USUARIO', 'DELETE')).toBe(false);
    expect(hasPermission(undefined, 'USUARIO', 'VIEW')).toBe(false);
  });
});
