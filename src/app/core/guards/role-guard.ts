import { CanActivateFn } from '@angular/router';
import { Login } from '../services/login';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const roleGuard: CanActivateFn = (route, state) => {
  const loginService = inject(Login);
  const router = inject(Router);
  const decoded = loginService.getDecodedToken();

  if (decoded?.roles.includes('ADMIN') || decoded?.roles.includes('MANAGER')) {
    return true;
  }
  router.navigate(['/login']);
  return false;
};
