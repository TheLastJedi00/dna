import { ChangeDetectionStrategy, Component, computed, inject, output, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { LoginService } from '../../../core/services/login.service';
import { UserService } from '../../../core/services/user.service';
import { ToastService } from '../../../core/services/toast.service';
import { reauthErrorMessage } from '../../../core/utils/firebase-auth-error';
import { httpErrorMessage } from '../../../core/utils/http-error-message';

/** Palavra que a pessoa digita para confirmar (evita exclusão por engano). */
export const CONFIRM_WORD = 'EXCLUIR';

/**
 * Excluir a conta (LGPD, spec 010). Hard delete: não dá para desfazer. Pede a
 * senha (reautenticação, exigida pela API como login recente) e a digitação de
 * EXCLUIR; depois encerra a sessão e volta para a entrada do app com o aviso.
 */
@Component({
  selector: 'app-delete-account',
  imports: [FormsModule],
  templateUrl: './delete-account.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteAccount {
  private readonly login = inject(LoginService);
  private readonly users = inject(UserService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  cancel = output<void>();

  readonly confirmWord = CONFIRM_WORD;
  readonly password = signal('');
  readonly typed = signal('');
  readonly deleting = signal(false);
  readonly error = signal<string | null>(null);

  readonly canDelete = computed(
    () => this.password().length > 0 && this.typed().trim() === CONFIRM_WORD && !this.deleting(),
  );

  async submit() {
    if (!this.canDelete()) return;
    this.deleting.set(true);
    this.error.set(null);
    try {
      await this.login.reauthenticate(this.password());
    } catch (e) {
      this.error.set(reauthErrorMessage(e, 'Não foi possível confirmar sua senha. Tente novamente.'));
      this.deleting.set(false);
      return;
    }
    try {
      await firstValueFrom(this.users.deleteMe());
    } catch (e) {
      this.error.set(
        e instanceof HttpErrorResponse
          ? httpErrorMessage(e, { preferServer: true })
          : 'Não foi possível excluir a conta. Tente novamente.',
      );
      this.deleting.set(false);
      return;
    }
    await this.login.logout();
    this.toast.show('Sua conta foi excluída. Seu acesso e todos os seus dados foram apagados.');
    await this.router.navigate(['/']);
  }
}
