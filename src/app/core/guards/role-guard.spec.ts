import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Router } from '@angular/router';
import { roleGuard } from './role-guard';
import { LoginService } from '../services/login.service';

describe('roleGuard', () => {
  let router: jasmine.SpyObj<Router>;
  let login: { getUserRole: () => string[] | null };

  const run = () =>
    TestBed.runInInjectionContext(() => roleGuard({} as any, {} as any));

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    login = { getUserRole: () => [] };
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        { provide: Router, useValue: router },
        { provide: LoginService, useValue: login },
      ],
    });
  });

  it('permite ADMIN', () => {
    login.getUserRole = () => ['ADMIN'];
    expect(run()).toBeTrue();
  });

  it('permite MANAGER', () => {
    login.getUserRole = () => ['MANAGER'];
    expect(run()).toBeTrue();
  });

  it('bloqueia USER e redireciona', () => {
    login.getUserRole = () => ['USER'];
    expect(run()).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('não quebra com roles null', () => {
    login.getUserRole = () => null;
    expect(run()).toBeFalse();
  });
});
