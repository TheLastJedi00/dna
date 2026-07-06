import { Component, inject, output, signal } from '@angular/core';
import { IconTextButton } from '../../buttons/icon-text-button/icon-text-button';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserData } from '../../../core/models/userdata.model';
import { UserService } from '../../../core/services/user.service';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Infinity } from '../../loading/infinity/infinity';

@Component({
  selector: 'app-new-user-form',
  imports: [IconTextButton, ReactiveFormsModule, Infinity],
  templateUrl: './new-user-form.html',
  styleUrl: './new-user-form.scss',
})
export class NewUserForm {
  private fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  modalClosed = output<void>()
  isPassVisible = signal<boolean>(false);
  passwordInputType = signal<string>('password');
  isFormOpen = signal(false);
  isLoading = signal(false);

  onClose(){
    this.isFormOpen.set(false)
    this.modalClosed.emit()
  }

  togglePassVisibility() {
    this.isPassVisible.update((v) => !v);
    this.passwordInputType() === 'password'
      ? this.passwordInputType.set('text')
      : this.passwordInputType.set('password');
  }

  protected createUserForm = this.fb.nonNullable.group({
    fullName: ['', [Validators.required]],
    birthDate: ['', [Validators.required]],
    birthTime: ['', [Validators.required]],
    birthCity: ['', [Validators.required]],
    birthUf: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  async createUser() {
    this.isLoading.set(true);
    const form = this.createUserForm.getRawValue();
    if (this.createUserForm.invalid) {
      this.createUserForm.markAllAsTouched();
      return;
    }
    try {
      const user: UserData = {
        fullName: form.fullName,
        birthDate: form.birthDate,
        birthPlace: `${form.birthCity}-${form.birthUf}`,
        birthTime: form.birthTime,
        login: {
          email: form.email,
          password: form.password,
        },
      };
      await firstValueFrom(this.userService.createMaestra(user));
      alert('Nova Maestra cadastrada com sucesso.');
    } catch (e) {
      console.error(e);
    } finally {
      this.isLoading.set(false);
      this.createUserForm.reset();
    }
  }
}
