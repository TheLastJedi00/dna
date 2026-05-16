import { Component, inject, signal } from '@angular/core';
import { FlatButton } from '../../buttons/flat-button/flat-button';
import { Logo } from '../../logo/logo';
import { LoginService } from '../../../core/services/login.service';
import { Router } from '@angular/router';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Infinity } from '../../loading/infinity/infinity';

@Component({
  selector: 'app-login-form',
  imports: [FlatButton, Logo, FormsModule, Infinity, ReactiveFormsModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export class LoginForm {
  private readonly loginService = inject(LoginService);
  private readonly router = inject(Router);
  
  fb = inject(FormBuilder)
  isLoading = signal(false);
  error = signal<string | null>(null);

  protected loginForm = this.fb.nonNullable.group({
    email: this.fb.nonNullable.control('',[Validators.email, Validators.required]),
    password: this.fb.nonNullable.control('', [Validators.required])
  })

  async onLogin() {
    this.isLoading.set(true);
    const form = this.loginForm.getRawValue()
    try {
      await firstValueFrom(this.loginService.login(form.email, form.password));
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
