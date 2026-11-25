import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { LoginService } from '../services/login.service';

/**
 * Exige sessão. Espera o Firebase restaurar a sessão salva antes de decidir —
 * no F5 ela volta de forma assíncrona e decidir antes mandaria quem está
 * logado para o login.
 */
export const authGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const service = inject(LoginService);

  await service.whenReady();
  if (service.isSessionValid()) {
    return true;
  }
  service.clearSession();
  router.navigate(['/login']);
  return false;
};
