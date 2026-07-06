import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { LoginService } from '../services/login.service';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const service = inject(LoginService);

  if (service.isSessionValid()) {
    return true;
  }
  service.clearSession();
  router.navigate(['/login']);
  return false;
};
