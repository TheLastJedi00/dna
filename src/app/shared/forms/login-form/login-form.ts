import { Component, inject, signal } from '@angular/core';
import { FlatButton } from '../../buttons/flat-button/flat-button';
import { Logo } from '../../logo/logo';
import { Login } from '../../../core/services/login';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  imports: [FlatButton, Logo, FormsModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export class LoginForm {
  private readonly loginService = inject(Login);
  private readonly router = inject(Router);

  email = signal('');
  password = signal('');
  loading = signal(false);
  error = signal<string | null>(null);

  onLogin() {
    this.loading.set(true);
    this.error.set(null);

    this.loginService.login(this.email(), this.password()).subscribe({
      next: (response: any) => {
        localStorage.setItem('access_token', response.access_token);
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set('E-mail ou senha inválidos.');
      },
    });
  }
}
