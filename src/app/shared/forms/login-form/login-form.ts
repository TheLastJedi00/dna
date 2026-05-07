import { Component, inject, signal } from '@angular/core';
import { FlatButton } from '../../buttons/flat-button/flat-button';
import { Logo } from '../../logo/logo';
import { LoginService } from '../../../core/services/login-service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Infinity } from '../../loading/infinity/infinity';

@Component({
  selector: 'app-login-form',
  imports: [FlatButton, Logo, FormsModule, Infinity ],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export class LoginForm {
  private readonly loginService = inject(LoginService);
  private readonly router = inject(Router);

  email = signal('');
  password = signal('');
  isLoading = signal(false);
  error = signal<string | null>(null);

  isValid() {
    return this.email() === '' || this.password() === '';
  }

  async onLogin() {
    this.isLoading.set(true);
    try {
      await firstValueFrom(this.loginService.login(this.email(), this.password()));
      const user = this.loginService.getDecodedToken();
      this.router.navigate([`/dashboard/${user?.id}`]);
    } catch (e) {
      if (e instanceof HttpErrorResponse) {
        this.error.set(e.error.message);
      }
      console.error(e);
    } finally {
      this.isLoading.set(false);
    }
  }
}
