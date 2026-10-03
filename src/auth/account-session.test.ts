import { afterEach, describe, expect, it, vi } from 'vitest';
import { authOptions } from '../pages/api/auth/[...nextauth]';

vi.mock('next-auth', () => ({ default: vi.fn() }));
vi.mock('../services/api', () => ({ apiPostLogin: vi.fn() }));

const jwt = authOptions.callbacks!.jwt!;

describe('atualização da sessão após editar a própria conta', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('relê o nome autenticado na API e ignora identidade e permissões do cliente', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ nome: 'Nome salvo' }) });
    vi.stubGlobal('fetch', fetchMock);
    const token = { name: 'Anterior', username: '00000000535', accessToken: 'token-original',
      accessTokenExpiresAt: Date.now() + 60_000, resource: {} };
    const result = await jwt({ token, trigger: 'update',
      session: { name: 'Nome falso', username: 'outro', accessToken: 'token-falso', resource: { USUARIO: ['UPDATE'] } },
    } as Parameters<typeof jwt>[0]);

    expect(result).toEqual({ ...token, name: 'Nome salvo' });
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('/usuario/me'), {
      headers: { Authorization: 'Bearer token-original' },
    });
  });

  it('preserva a sessão quando a API estiver indisponível', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    const token = { name: 'Anterior', accessToken: 'token', accessTokenExpiresAt: Date.now() + 60_000 };
    expect(await jwt({ token, trigger: 'update' } as Parameters<typeof jwt>[0])).toEqual(token);
  });

  it('não consulta a API com token expirado', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const token = { name: 'Anterior', accessToken: 'token', accessTokenExpiresAt: Date.now() - 1 };
    expect(await jwt({ token, trigger: 'update' } as Parameters<typeof jwt>[0])).toEqual(token);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
