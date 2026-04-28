import { Component, inject } from '@angular/core';
import { LandingHeader } from '../../shared/headers/landing-header/landing-header';
import { LoginForm } from '../../shared/forms/login-form/login-form';
import { LandingFooter } from '../../shared/footers/landing-footer/landing-footer';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login',
  imports: [LandingHeader, LoginForm, LandingFooter],
  templateUrl: './user-login.html',
  styleUrl: './user-login.scss',
})
export class UserLogin {
  router = inject(Router);

  navigateToUserPanel() {
    this.router.navigate(['/user-dashboard']);
  }

  navigateToAdminPanel() {
    this.router.navigate(['/manager-dashboard']);
  }
}
