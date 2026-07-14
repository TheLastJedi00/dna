import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IconTextButton } from '../../buttons/icon-text-button/icon-text-button';
import { AnalystData } from '../../../core/models/analyst.model';

/** O que o form devolve à página; `login` só existe na criação. */
export interface AnalystFormValue {
  fullName: string;
  login?: {
    email: string;
    password: string;
  };
}

/**
 * Form de Analista, usado para **criar** e **editar**. Sem `analyst` é criação
 * (com o gatilho "Novo Analista") e pede as credenciais de acesso; com
 * `analyst` é edição e só o nome é editável — e-mail e senha vivem no documento
 * `auth` e não são alteráveis por aqui.
 *
 * Dumb: emite `save` com o valor do formulário; quem chama o AnalystService é a
 * página smart (global-strategy §2.2).
 */
@Component({
  selector: 'app-analyst-form',
  imports: [IconTextButton, ReactiveFormsModule],
  templateUrl: './analyst-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalystForm {
  private readonly fb = inject(FormBuilder);

  /** Analista em edição; ausente => modo criação. */
  analyst = input<AnalystData | null>(null);
  /** Exibe o botão-gatilho "Novo Analista" (criação). */
  showTrigger = input<boolean>(true);
  /** Estado de abertura do modal (controlável pelo pai). */
  open = model<boolean>(false);

  save = output<AnalystFormValue>();
  modalClosed = output<void>();

  isEditing = computed(() => !!this.analyst());
  passwordInputType = signal<'password' | 'text'>('password');

  protected analystForm = this.fb.nonNullable.group({
    fullName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  constructor() {
    effect(() => {
      this.applyModeValidators();
      if (this.open() && this.isEditing()) {
        this.analystForm.patchValue({ fullName: this.analyst()!.fullName });
      }
    });
  }

  /** Na edição não há campos de acesso: os validadores deles saem do caminho. */
  private applyModeValidators() {
    const { email, password } = this.analystForm.controls;
    if (this.isEditing()) {
      email.clearValidators();
      password.clearValidators();
    } else {
      email.setValidators([Validators.required, Validators.email]);
      password.setValidators([Validators.required]);
    }
    email.updateValueAndValidity({ emitEvent: false });
    password.updateValueAndValidity({ emitEvent: false });
  }

  togglePassVisibility() {
    this.passwordInputType.update((type) =>
      type === 'password' ? 'text' : 'password',
    );
  }

  submit() {
    if (this.analystForm.invalid) {
      this.analystForm.markAllAsTouched();
      return;
    }
    const form = this.analystForm.getRawValue();
    this.save.emit(
      this.isEditing()
        ? { fullName: form.fullName }
        : {
            fullName: form.fullName,
            login: { email: form.email, password: form.password },
          },
    );
    this.reset();
  }

  onCancel() {
    this.reset();
    this.modalClosed.emit();
  }

  private reset() {
    this.open.set(false);
    this.analystForm.reset();
  }
}
