import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { LoginService } from '../services/login.service';

export const roleGuard: CanActivateFn = () => {
  const loginService = inject(LoginService);
  const router = inject(Router);
  const roles = loginService.getUserRole();

  if (roles?.includes('ADMIN') || roles?.includes('MANAGER')) {
    return true;
  }
  router.navigate(['/login']);
  return false;
};
