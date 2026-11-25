import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { LoginService } from '../services/login.service';

/**
 * Quem ainda não confirmou o e-mail (spec 010) só usa o dashboard (onde fica o
 * popup de verificação) e o Meu Perfil (para corrigir o e-mail). Qualquer
 * outra rota autenticada volta ao dashboard. A API também recusa (403) —
 * este guard só evita a tela quebrada.
 */
export const emailVerifiedGuard: CanActivateFn = async () => {
  const loginService = inject(LoginService);
  const router = inject(Router);
  await loginService.whenReady();

  if (loginService.isEmailVerified()) {
    return true;
  }
  router.navigate(['/dashboard']);
  return false;
};
