import { routes } from './app.routes';

describe('rotas (spec 010: "usuários" no lugar de "maestras")', () => {
  const paths = routes.map((r) => r.path);

  it('detalhe do usuário na gestão é user-supply/:userId', () => {
    expect(paths).toContain('user-supply/:userId');
    expect(paths).not.toContain('user-supply/:maestraId');
  });

  it('o endereço antigo management/maestras redireciona para management/users', () => {
    const old = routes.find((r) => r.path === 'management/maestras');
    expect(old?.redirectTo).toBe('management/users');
  });
});
