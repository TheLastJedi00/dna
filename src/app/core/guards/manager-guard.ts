import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { LoginService } from '../services/login.service';

/**
 * Gestão de Analistas: só ADMIN e MANAGER. Espelha o `@Role(ADMIN, MANAGER)` do
 * AnalystsController — o Analista não alcança nenhuma rota de /analysts.
 */
export const managerGuard: CanActivateFn = () => {
  const loginService = inject(LoginService);
  const router = inject(Router);
  const roles = loginService.getUserRole();

  if (roles?.includes('ADMIN') || roles?.includes('MANAGER')) {
    return true;
  }
  router.navigate(['/dashboard']);
  return false;
};
