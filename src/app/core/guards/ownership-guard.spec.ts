import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  convertToParamMap,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { ownershipGuard } from './ownership-guard';
import { LoginService } from '../services/login.service';

describe('ownershipGuard', () => {
  let router: jasmine.SpyObj<Router>;
  let login: {
    isSessionValid: () => boolean;
    getUserRole: () => string[];
    userId: string;
  };

  const run = (userId: string) => {
    const route = {
      paramMap: convertToParamMap({ userId }),
    } as unknown as ActivatedRouteSnapshot;
    return TestBed.runInInjectionContext(() =>
      ownershipGuard(route, {} as RouterStateSnapshot),
    );
  };

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    login = { isSessionValid: () => true, getUserRole: () => [], userId: '' };
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        { provide: Router, useValue: router },
        { provide: LoginService, useValue: login },
      ],
    });
  });

  it('permite o próprio usuário', () => {
    login.userId = 'u1';
    expect(run('u1')).toBeTrue();
  });

  it('bloqueia outro usuário e redireciona ao dashboard', () => {
    login.userId = 'u1';
    expect(run('u2')).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('permite ADMIN em qualquer userId', () => {
    login.getUserRole = () => ['ADMIN'];
    login.userId = 'admin';
    expect(run('outro')).toBeTrue();
  });

  it('sessão inválida vai para login', () => {
    login.isSessionValid = () => false;
    expect(run('u1')).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
