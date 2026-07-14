import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  provideRouter,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { passwordChangedGuard, passwordGuard } from './password-guard';
import { LoginService } from '../services/login.service';

/**
 * O bloqueio da troca obrigatória lê o **claim do token**, não um estado de
 * memória — é isso que impede burlá-lo com F5 ou com a URL digitada à mão
 * (critério de aceite da spec 005).
 */
describe('passwordGuard', () => {
  let loginService: jasmine.SpyObj<Pick<LoginService, 'mustChangePassword'>>;
  let router: Router;

  const run = (guard: CanActivateFn, mustChange: boolean) => {
    loginService.mustChangePassword.and.returnValue(mustChange);
    return TestBed.runInInjectionContext(() =>
      guard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );
  };

  beforeEach(() => {
    loginService = jasmine.createSpyObj('LoginService', ['mustChangePassword']);
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: LoginService, useValue: loginService },
      ],
    });
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
  });

  it('com senha provisória, empurra qualquer rota protegida para a troca', () => {
    expect(run(passwordGuard, true)).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/change-password']);
  });

  it('com a senha já definida, deixa navegar', () => {
    expect(run(passwordGuard, false)).toBeTrue();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('a decisão vem do token: recarregar a página não escapa do bloqueio', () => {
    // Uma nova avaliação do guard (o que um F5 provoca) volta a consultar o
    // claim — não há estado em memória que o reload possa zerar.
    expect(run(passwordGuard, true)).toBeFalse();
    expect(run(passwordGuard, true)).toBeFalse();
    expect(loginService.mustChangePassword).toHaveBeenCalledTimes(2);
  });

  describe('passwordChangedGuard (/change-password)', () => {
    it('deixa entrar quem ainda precisa trocar', () => {
      expect(run(passwordChangedGuard, true)).toBeTrue();
    });

    it('devolve ao painel quem já trocou — a tela não vira armadilha', () => {
      expect(run(passwordChangedGuard, false)).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    });
  });
});
