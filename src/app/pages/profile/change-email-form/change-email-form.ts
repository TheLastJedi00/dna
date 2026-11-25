import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../../core/services/login.service';
import { reauthErrorMessage } from '../../../core/utils/firebase-auth-error';

/**
 * Alterar e-mail no Meu Perfil (spec 010). O Firebase **só troca o e-mail
 * quando a pessoa abre o link enviado ao novo endereço**; até lá ela continua
 * entrando com o atual. Depois da troca, o Firebase encerra a sessão e o
 * próximo login já é com o e-mail novo.
 */
@Component({
  selector: 'app-change-email-form',
  imports: [ReactiveFormsModule],
  templateUrl: './change-email-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangeEmailForm {
  private readonly fb = inject(FormBuilder);
  private readonly login = inject(LoginService);

  cancel = output<void>();

  readonly currentEmail = this.login.email;
  readonly saving = signal(false);
  /** E-mail para o qual o link foi enviado. */
  readonly sentTo = signal<string | null>(null);
  readonly error = signal<string | null>(null);

  protected form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const email = this.form.controls.email.value.trim();
    if (email.toLowerCase() === this.currentEmail.toLowerCase()) {
      this.error.set('Este já é o seu e-mail.');
      return;
    }
    this.saving.set(true);
    this.error.set(null);
    try {
      await this.login.changeEmail(this.form.controls.password.value, email);
      this.form.reset();
      this.sentTo.set(email);
    } catch (e) {
      this.error.set(reauthErrorMessage(e, 'Não foi possível alterar o e-mail. Tente novamente.'));
    } finally {
      this.saving.set(false);
    }
  }
}
