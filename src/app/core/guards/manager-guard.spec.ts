import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { provideRouter } from '@angular/router';

import { managerGuard } from './manager-guard';
import { roleGuard } from './role-guard';
import { LoginService } from '../services/login.service';
import { UserRole } from '../../types/types';

describe('guards de gestão', () => {
  let loginService: jasmine.SpyObj<Pick<LoginService, 'getUserRole' | 'whenReady'>>;
  let router: Router;

  const run = (guard: typeof managerGuard, roles: UserRole[] | null) => {
    loginService.getUserRole.and.returnValue(roles);
    return TestBed.runInInjectionContext(() =>
      guard(
        {} as ActivatedRouteSnapshot,
        {} as RouterStateSnapshot,
      ),
    );
  };

  beforeEach(() => {
    loginService = jasmine.createSpyObj('LoginService', ['getUserRole', 'whenReady']);
    loginService.whenReady.and.resolveTo(undefined);
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

  describe('managerGuard (/analysts)', () => {
    it('libera ADMIN e MANAGER', async () => {
      expect(await run(managerGuard, ['ADMIN'])).toBeTrue();
      expect(await run(managerGuard, ['MANAGER'])).toBeTrue();
    });

    it('bloqueia o ANALYST — ele não gerencia analistas', async () => {
      expect(await run(managerGuard, ['ANALYST'])).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    });

    it('bloqueia USER e sessão sem roles', async () => {
      expect(await run(managerGuard, ['USER'])).toBeFalse();
      expect(await run(managerGuard, null)).toBeFalse();
    });
  });

  describe('roleGuard (gestão de usuários)', () => {
    it('libera ADMIN, MANAGER e ANALYST', async () => {
      expect(await run(roleGuard, ['ADMIN'])).toBeTrue();
      expect(await run(roleGuard, ['MANAGER'])).toBeTrue();
      expect(await run(roleGuard, ['ANALYST'])).toBeTrue();
    });

    it('bloqueia o usuário cliente (USER)', async () => {
      expect(await run(roleGuard, ['USER'])).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });
});
