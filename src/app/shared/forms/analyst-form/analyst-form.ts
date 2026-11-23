import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IconTextButton } from '../../buttons/icon-text-button/icon-text-button';
import { AnalystData } from '../../../core/models/analyst.model';

/** O que o form devolve à página; `email` só existe na criação (convite). */
export interface AnalystFormValue {
  fullName: string;
  email?: string;
}

/**
 * Form de Analista, usado para **criar** e **editar**. Sem `analyst` é criação
 * (com o gatilho "Novo Analista") e pede o e-mail de acesso — sem senha: o
 * acesso é definido pelo convite por e-mail (spec 010); com `analyst` é edição
 * e só o nome é editável (o e-mail é do Firebase Auth).
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

  protected analystForm = this.fb.nonNullable.group({
    fullName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
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
    const { email } = this.analystForm.controls;
    if (this.isEditing()) {
      email.clearValidators();
    } else {
      email.setValidators([Validators.required, Validators.email]);
    }
    email.updateValueAndValidity({ emitEvent: false });
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
        : { fullName: form.fullName, email: form.email.trim() },
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
