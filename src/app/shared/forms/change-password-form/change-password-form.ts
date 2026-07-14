import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AppButton } from '../../buttons/app-button/app-button';

/** As duas senhas precisam coincidir — validado no grupo, não no campo. */
function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirmation = group.get('confirmation')?.value;
  return password === confirmation ? null : { mismatch: true };
}

/**
 * Form da senha definitiva. Dumb: emite a senha escolhida e a página é quem
 * chama o LoginService.
 */
@Component({
  selector: 'app-change-password-form',
  imports: [ReactiveFormsModule, AppButton],
  templateUrl: './change-password-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordForm {
  private readonly fb = inject(FormBuilder);

  isLoading = input<boolean>(false);
  error = input<string | null>(null);

  save = output<string>();

  protected form = this.fb.nonNullable.group(
    {
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmation: ['', [Validators.required]],
    },
    { validators: passwordsMatch },
  );

  protected get isMismatch(): boolean {
    return (
      this.form.hasError('mismatch') &&
      this.form.controls.confirmation.touched
    );
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.save.emit(this.form.getRawValue().password);
  }
}
