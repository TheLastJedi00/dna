import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { LoginService } from '../../../core/services/login.service';
import { reauthErrorMessage } from '../../../core/utils/firebase-auth-error';

/** Mesma regra mínima do Firebase (e da antiga troca de senha). */
export const MIN_PASSWORD_LENGTH = 6;

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const next = group.get('next')?.value;
  const confirm = group.get('confirm')?.value;
  return next && confirm && next !== confirm ? { mismatch: true } : null;
}

/** Alterar senha no Meu Perfil: reautentica com a atual e grava a nova no Firebase. */
@Component({
  selector: 'app-change-password-form',
  imports: [ReactiveFormsModule],
  templateUrl: './change-password-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordForm {
  private readonly fb = inject(FormBuilder);
  private readonly login = inject(LoginService);

  cancel = output<void>();

  readonly saving = signal(false);
  readonly done = signal(false);
  readonly error = signal<string | null>(null);
  readonly minLength = MIN_PASSWORD_LENGTH;

  protected form = this.fb.nonNullable.group(
    {
      current: ['', [Validators.required]],
      next: ['', [Validators.required, Validators.minLength(MIN_PASSWORD_LENGTH)]],
      confirm: ['', [Validators.required]],
    },
    { validators: passwordsMatch },
  );

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.error.set(null);
    this.done.set(false);
    const { current, next } = this.form.getRawValue();
    try {
      await this.login.changePassword(current, next);
      this.form.reset();
      this.done.set(true);
    } catch (e) {
      this.error.set(reauthErrorMessage(e, 'Não foi possível alterar a senha. Tente novamente.'));
    } finally {
      this.saving.set(false);
    }
  }
}
