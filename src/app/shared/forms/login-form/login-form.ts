import { Component, inject, signal } from '@angular/core';
import { AppButton } from '../../buttons/app-button/app-button';
import { Logo } from '../../logo/logo';
import { LoginService } from '../../../core/services/login.service';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Infinity } from '../../loading/infinity/infinity';
import { authErrorMessage } from '../../../core/utils/firebase-auth-error';

@Component({
  selector: 'app-login-form',
  imports: [AppButton, Logo, Infinity, ReactiveFormsModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export class LoginForm {
  private readonly loginService = inject(LoginService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  isLoading = signal(false);
  error = signal<string | null>(null);

  protected loginForm = this.fb.nonNullable.group({
    email: this.fb.nonNullable.control('', [Validators.email, Validators.required]),
    password: this.fb.nonNullable.control('', [Validators.required]),
  });

  async onLogin() {
    if (this.loginForm.invalid) return;
    this.isLoading.set(true);
    this.error.set(null);
    const { email, password } = this.loginForm.getRawValue();
    try {
      await this.loginService.login(email.trim(), password);
      await this.router.navigate(['/dashboard']);
    } catch (e) {
      this.error.set(authErrorMessage(e));
    } finally {
      this.isLoading.set(false);
    }
  }
}
