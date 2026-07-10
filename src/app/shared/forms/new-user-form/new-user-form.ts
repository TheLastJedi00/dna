import {
  Component,
  computed,
  effect,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { IconTextButton } from '../../buttons/icon-text-button/icon-text-button';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserData } from '../../../core/models/userdata.model';
import { UserService } from '../../../core/services/user.service';
import { firstValueFrom } from 'rxjs';
import { Infinity } from '../../loading/infinity/infinity';

/**
 * Form de Maestra reutilizado para **criar** e **editar**. Sem `user` é criação
 * (com o gatilho "Nova Maestra"); com `user` é edição (prefill + updateUser,
 * sem os campos de acesso). O estado de abertura é controlável via `open`.
 */
@Component({
  selector: 'app-new-user-form',
  imports: [IconTextButton, ReactiveFormsModule, Infinity],
  templateUrl: './new-user-form.html',
  styleUrl: './new-user-form.scss',
})
export class NewUserForm {
  private fb = inject(FormBuilder);
  private readonly userService = inject(UserService);

  /** Maestra em edição; ausente => modo criação. */
  user = input<UserData | null>(null);
  /** Exibe o botão-gatilho "Nova Maestra" (criação). */
  showTrigger = input<boolean>(true);
  /** Estado de abertura do modal (controlável pelo pai). */
  open = model<boolean>(false);

  modalClosed = output<void>();
  saved = output<void>();

  isEditing = computed(() => !!this.user());
  isPassVisible = signal<boolean>(false);
  passwordInputType = signal<string>('password');
  isLoading = signal(false);

  protected createUserForm = this.fb.nonNullable.group({
    fullName: ['', [Validators.required]],
    birthDate: ['', [Validators.required]],
    birthTime: ['', [Validators.required]],
    birthCity: ['', [Validators.required]],
    birthUf: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  constructor() {
    effect(() => {
      this.applyModeValidators();
      if (this.open() && this.isEditing()) {
        this.patchFromUser();
      }
    });
  }

  private applyModeValidators() {
    const { email, password } = this.createUserForm.controls;
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

  private patchFromUser() {
    const u = this.user();
    if (!u) return;
    const sep = u.birthPlace.lastIndexOf('-');
    const city = sep >= 0 ? u.birthPlace.slice(0, sep) : u.birthPlace;
    const uf = sep >= 0 ? u.birthPlace.slice(sep + 1) : '';
    this.createUserForm.patchValue({
      fullName: u.fullName,
      birthDate: u.birthDate,
      birthTime: u.birthTime,
      birthCity: city,
      birthUf: uf,
    });
  }

  onCancel() {
    this.reset();
    this.modalClosed.emit();
  }

  togglePassVisibility() {
    this.isPassVisible.update((v) => !v);
    this.passwordInputType.set(
      this.passwordInputType() === 'password' ? 'text' : 'password',
    );
  }

  async submit() {
    if (this.createUserForm.invalid) {
      this.createUserForm.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    const form = this.createUserForm.getRawValue();
    const profile = {
      fullName: form.fullName,
      birthDate: form.birthDate,
      birthTime: form.birthTime,
      birthPlace: `${form.birthCity}-${form.birthUf}`,
    };
    try {
      if (this.isEditing()) {
        await firstValueFrom(
          this.userService.updateUser(this.user()!.id!, profile),
        );
      } else {
        await firstValueFrom(
          this.userService.createMaestra({
            ...profile,
            login: { email: form.email, password: form.password },
          }),
        );
      }
      this.reset();
      this.saved.emit();
    } catch {
      // erro HTTP exibido pelo errorInterceptor global
    } finally {
      this.isLoading.set(false);
    }
  }

  private reset() {
    this.open.set(false);
    this.createUserForm.reset();
  }
}
