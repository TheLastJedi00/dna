import { Component, inject, signal } from '@angular/core';
import { AppButton } from '../../buttons/app-button/app-button';
import { Logo } from '../../logo/logo';
import { LoginService } from '../../../core/services/login.service';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Infinity } from '../../loading/infinity/infinity';
import { authErrorMessage, firebaseAuthCode } from '../../../core/utils/firebase-auth-error';

/** Erros da redefinição que a pessoa consegue resolver; o resto vira resposta neutra. */
const FORGOT_ERRORS_SHOWN = [
  'auth/invalid-email',
  'auth/network-request-failed',
  'auth/too-many-requests',
];

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
  /** `login` (padrão) ou `forgot` ("Esqueci minha senha"). */
  mode = signal<'login' | 'forgot'>('login');
  resetSent = signal(false);

  protected loginForm = this.fb.nonNullable.group({
    email: this.fb.nonNullable.control('', [Validators.email, Validators.required]),
    password: this.fb.nonNullable.control('', [Validators.required]),
  });

  protected forgotForm = this.fb.nonNullable.group({
    email: this.fb.nonNullable.control('', [Validators.email, Validators.required]),
  });

  /** Abre o passo de redefinição já com o e-mail digitado no login. */
  showForgot() {
    this.forgotForm.setValue({ email: this.loginForm.controls.email.value.trim() });
    this.resetSent.set(false);
    this.error.set(null);
    this.mode.set('forgot');
  }

  showLogin() {
    this.error.set(null);
    this.mode.set('login');
  }

  /**
   * Envia o link de redefinição. A resposta é **sempre a mesma**, exista ou não
   * a conta: dizer "e-mail não cadastrado" revelaria quem tem acesso. Só erros
   * que a pessoa pode corrigir (e-mail inválido, sem conexão, limite) aparecem.
   */
  async onForgot() {
    if (this.forgotForm.invalid) return;
    this.isLoading.set(true);
    this.error.set(null);
    try {
      await this.loginService.sendPasswordReset(this.forgotForm.getRawValue().email.trim());
      this.resetSent.set(true);
    } catch (e) {
      const code = firebaseAuthCode(e);
      if (code && FORGOT_ERRORS_SHOWN.includes(code)) {
        this.error.set(authErrorMessage(e));
      } else {
        this.resetSent.set(true);
      }
    } finally {
      this.isLoading.set(false);
    }
  }

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
