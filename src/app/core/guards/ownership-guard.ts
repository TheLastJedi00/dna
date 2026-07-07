import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { LoginService } from '../services/login.service';

/**
 * Impede que um usuário acesse rotas de outro usuário. Compara o parâmetro
 * `:userId` (ou `:maestraId`) com o id do token. ADMIN/MANAGER passam sempre.
 */
export const ownershipGuard: CanActivateFn = (route) => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  if (!loginService.isSessionValid()) {
    router.navigate(['/login']);
    return false;
  }

  const roles = loginService.getUserRole() ?? [];
  if (roles.includes('ADMIN') || roles.includes('MANAGER')) {
    return true;
  }

  const routeUserId = route.paramMap.get('userId') ?? route.paramMap.get('maestraId');
  if (routeUserId && routeUserId === loginService.userId) {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};
