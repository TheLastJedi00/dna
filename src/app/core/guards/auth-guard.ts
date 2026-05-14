import { CanActivateFn } from '@angular/router';
import { LoginService } from '../services/login.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('access_token');
  const service = inject(LoginService);
  const decode = service.getDecodedToken();
  if (!token && !decode) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};
