import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { LoginService } from '../services/login.service';

/**
 * Impede que um usuário acesse rotas de outro usuário. Compara o parâmetro
 * `:userId` com o id do token. ADMIN/MANAGER passam sempre.
 */
export const ownershipGuard: CanActivateFn = async (route) => {
  const loginService = inject(LoginService);
  const router = inject(Router);
  await loginService.whenReady();

  if (!loginService.isSessionValid()) {
    router.navigate(['/login']);
    return false;
  }

  const roles = loginService.getUserRole() ?? [];
  if (roles.includes('ADMIN') || roles.includes('MANAGER')) {
    return true;
  }

  const routeUserId = route.paramMap.get('userId');
  if (routeUserId && routeUserId === loginService.userId) {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};
