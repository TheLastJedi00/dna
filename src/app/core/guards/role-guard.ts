import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { LoginService } from '../services/login.service';

/**
 * Rotas de gestão de Maestras. O Analista cadastra e acompanha as próprias
 * Maestras (spec 004), por isso entra aqui junto com ADMIN e MANAGER — a
 * visibilidade (só as que ele cadastrou) é imposta pelo backend.
 */
export const roleGuard: CanActivateFn = () => {
  const loginService = inject(LoginService);
  const router = inject(Router);
  const roles = loginService.getUserRole();

  if (
    roles?.includes('ADMIN') ||
    roles?.includes('MANAGER') ||
    roles?.includes('ANALYST')
  ) {
    return true;
  }
  router.navigate(['/login']);
  return false;
};
