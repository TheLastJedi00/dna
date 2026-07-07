import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Router } from '@angular/router';
import { authGuard } from './auth-guard';
import { LoginService } from '../services/login.service';

describe('authGuard', () => {
  let router: jasmine.SpyObj<Router>;
  let login: { isSessionValid: () => boolean; clearSession: jasmine.Spy };

  const run = () =>
    TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    login = { isSessionValid: () => true, clearSession: jasmine.createSpy() };
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        { provide: Router, useValue: router },
        { provide: LoginService, useValue: login },
      ],
    });
  });

  it('permite sessão válida', () => {
    expect(run()).toBeTrue();
  });

  it('bloqueia e redireciona sessão inválida', () => {
    login.isSessionValid = () => false;
    expect(run()).toBeFalse();
    expect(login.clearSession).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
