import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { LoginService } from '../services/login.service';

/**
 * Trava a navegação enquanto a senha em uso for provisória: qualquer rota
 * protegida devolve o usuário para `/change-password`.
 *
 * O estado vem do **claim do token**, não de memória — por isso um F5 ou uma URL
 * digitada à mão não escapam do bloqueio (critério de aceite da spec 005).
 */
export const passwordGuard: CanActivateFn = () => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  if (loginService.mustChangePassword()) {
    router.navigate(['/change-password']);
    return false;
  }
  return true;
};

/**
 * O contrário, para a própria `/change-password`: quem já definiu a senha não
 * tem o que fazer lá e volta para o painel.
 */
export const passwordChangedGuard: CanActivateFn = () => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  if (loginService.mustChangePassword()) {
    return true;
  }
  router.navigate(['/dashboard']);
  return false;
};
