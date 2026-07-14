import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IconTextButton } from '../../buttons/icon-text-button/icon-text-button';

/**
 * Bloco de senha no detalhe do usuário, em dois estados (spec 005):
 *
 * - **provisória pendente** (`mustChangePassword`): mostra a senha em texto plano
 *   e o aviso de que ela é temporária. Sem botão de gerar — não faz sentido
 *   trocar uma senha que o usuário ainda nem usou.
 * - **senha definida**: mostra o botão "Gerar senha temporária", que abre o input
 *   para o gestor digitar uma nova (recuperação de acesso).
 *
 * Dumb: emite a senha digitada; quem chama a API é a página smart.
 */
@Component({
  selector: 'app-temp-password-form',
  imports: [IconTextButton, ReactiveFormsModule],
  templateUrl: './temp-password-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TempPasswordForm {
  private readonly fb = inject(FormBuilder);

  mustChangePassword = input<boolean>(false);
  tempPassword = input<string | null>(null);
  /** "usuária" (Maestra) x "usuário" (Analista) no texto do aviso. */
  subject = input<string>('o usuário');

  save = output<string>();

  isTyping = signal(false);

  protected form = this.fb.nonNullable.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  startTyping() {
    this.isTyping.set(true);
  }

  cancel() {
    this.form.reset();
    this.isTyping.set(false);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.save.emit(this.form.getRawValue().password);
    this.form.reset();
    this.isTyping.set(false);
  }
}
