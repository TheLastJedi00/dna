import { CanActivateFn } from '@angular/router';
import { Login } from '../services/login';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const loginService = inject(Login);
  const router = inject(Router);
  const token = localStorage.getItem('access_token');
  if (!token) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};
