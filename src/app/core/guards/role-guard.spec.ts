import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Router } from '@angular/router';
import { roleGuard } from './role-guard';
import { LoginService } from '../services/login.service';

describe('roleGuard', () => {
  let router: jasmine.SpyObj<Router>;
  let login: {
    getUserRole: () => string[] | null;
    whenReady: () => Promise<void>;
  };

  const run = () =>
    TestBed.runInInjectionContext(() => roleGuard({} as any, {} as any));

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    login = { getUserRole: () => [], whenReady: () => Promise.resolve() };
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        { provide: Router, useValue: router },
        { provide: LoginService, useValue: login },
      ],
    });
  });

  it('permite ADMIN', async () => {
    login.getUserRole = () => ['ADMIN'];
    expect(await run()).toBeTrue();
  });

  it('permite MANAGER', async () => {
    login.getUserRole = () => ['MANAGER'];
    expect(await run()).toBeTrue();
  });

  it('bloqueia USER e redireciona', async () => {
    login.getUserRole = () => ['USER'];
    expect(await run()).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('não quebra com roles null', async () => {
    login.getUserRole = () => null;
    expect(await run()).toBeFalse();
  });
});
