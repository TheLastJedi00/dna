import { CanActivateFn } from '@angular/router';
import { LoginService } from '../services/login-service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const roleGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService);
  const router = inject(Router);
  const decoded = loginService.getDecodedToken();

  if (decoded?.roles.includes('ADMIN') || decoded?.roles.includes('MANAGER')) {
    return true;
  }
  router.navigate(['/login']);
  return false;
};
