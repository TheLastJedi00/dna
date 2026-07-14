import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ChangePasswordForm } from '../../shared/forms/change-password-form/change-password-form';
import { AppButton } from '../../shared/buttons/app-button/app-button';
import { Infinity } from '../../shared/loading/infinity/infinity';
import { LoginService } from '../../core/services/login.service';

/**
 * Troca obrigatória da senha provisória. É uma **rota bloqueante**, não um modal
 * solto sobre o dashboard: o `passwordGuard` empurra qualquer rota protegida para
 * cá enquanto o claim `mustChangePassword` for true, então nem um F5 nem uma URL
 * digitada à mão escapam. A única saída sem trocar a senha é o logout.
 */
@Component({
  selector: 'app-change-password',
  imports: [ChangePasswordForm, AppButton, Infinity],
  templateUrl: './change-password.html',
})
export class ChangePassword {
  private readonly loginService = inject(LoginService);
  private readonly router = inject(Router);

  isLoading = signal(false);
  error = signal<string | null>(null);

  async onSave(password: string) {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      // A API devolve tokens novos (sem o claim); o LoginService os regrava, e é
      // isso que libera o passwordGuard na navegação seguinte.
      await firstValueFrom(this.loginService.changePassword(password));
      await this.router.navigate(['/dashboard']);
    } catch (e) {
      this.error.set(
        e instanceof HttpErrorResponse
          ? (e.error?.message ?? 'Não foi possível salvar a senha.')
          : 'Não foi possível salvar a senha.',
      );
    } finally {
      this.isLoading.set(false);
    }
  }

  logout() {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }
}
