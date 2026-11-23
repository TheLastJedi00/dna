import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { emailVerifiedGuard } from './email-verified-guard';
import { LoginService } from '../services/login.service';
import { FakeLoginService } from '../../testing/fake-login-service';
import { routes } from '../../app.routes';

describe('emailVerifiedGuard', () => {
  let router: jasmine.SpyObj<Router>;
  let login: FakeLoginService;

  const run = () =>
    TestBed.runInInjectionContext(() =>
      emailVerifiedGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    login = new FakeLoginService();
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        { provide: Router, useValue: router },
        { provide: LoginService, useValue: login },
      ],
    });
  });

  it('e-mail confirmado: libera', async () => {
    login.loginAs('u1', 'ana@dna.com', ['USER'], true);
    expect(await run()).toBeTrue();
  });

  it('e-mail não confirmado: volta ao dashboard', async () => {
    login.loginAs('u1', 'ana@dna.com', ['USER'], false);
    expect(await run()).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('protege toda rota autenticada, menos dashboard (e Meu Perfil)', () => {
    const liberadas = ['dashboard', 'profile'];
    const autenticadas = routes.filter((r) => r.canActivate?.length);
    for (const route of autenticadas) {
      const temGuard = route.canActivate!.includes(emailVerifiedGuard);
      expect(temGuard)
        .withContext(`rota ${route.path}`)
        .toBe(!liberadas.includes(route.path ?? ''));
    }
  });
});
