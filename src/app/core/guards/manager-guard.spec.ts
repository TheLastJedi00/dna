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
  let loginService: jasmine.SpyObj<Pick<LoginService, 'getUserRole'>>;
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
    loginService = jasmine.createSpyObj('LoginService', ['getUserRole']);
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
    it('libera ADMIN e MANAGER', () => {
      expect(run(managerGuard, ['ADMIN'])).toBeTrue();
      expect(run(managerGuard, ['MANAGER'])).toBeTrue();
    });

    it('bloqueia o ANALYST — ele não gerencia analistas', () => {
      expect(run(managerGuard, ['ANALYST'])).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    });

    it('bloqueia USER e sessão sem roles', () => {
      expect(run(managerGuard, ['USER'])).toBeFalse();
      expect(run(managerGuard, null)).toBeFalse();
    });
  });

  describe('roleGuard (gestão de Maestras)', () => {
    it('libera ADMIN, MANAGER e ANALYST', () => {
      expect(run(roleGuard, ['ADMIN'])).toBeTrue();
      expect(run(roleGuard, ['MANAGER'])).toBeTrue();
      expect(run(roleGuard, ['ANALYST'])).toBeTrue();
    });

    it('bloqueia a Maestra (USER)', () => {
      expect(run(roleGuard, ['USER'])).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });
});
