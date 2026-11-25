import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Router } from '@angular/router';
import { authGuard } from './auth-guard';
import { LoginService } from '../services/login.service';

describe('authGuard', () => {
  let router: jasmine.SpyObj<Router>;
  let login: {
    isSessionValid: () => boolean;
    clearSession: jasmine.Spy;
    whenReady: () => Promise<void>;
  };

  const run = () =>
    TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    login = {
      isSessionValid: () => true,
      clearSession: jasmine.createSpy(),
      whenReady: () => Promise.resolve(),
    };
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        { provide: Router, useValue: router },
        { provide: LoginService, useValue: login },
      ],
    });
  });

  it('espera a sessão ser restaurada antes de decidir (F5)', async () => {
    let restored = false;
    login.isSessionValid = () => restored;
    login.whenReady = () => {
      restored = true;
      return Promise.resolve();
    };
    expect(await run()).toBeTrue();
  });

  it('permite sessão válida', async () => {
    expect(await run()).toBeTrue();
  });

  it('bloqueia e redireciona sessão inválida', async () => {
    login.isSessionValid = () => false;
    expect(await run()).toBeFalse();
    expect(login.clearSession).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
