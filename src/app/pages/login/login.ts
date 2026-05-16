import { Component } from '@angular/core';
import { LandingHeader } from '../../shared/headers/landing-header/landing-header';
import { LoginForm } from '../../shared/forms/login-form/login-form';
import { LandingFooter } from '../../shared/footers/landing-footer/landing-footer';

@Component({
  selector: 'app-user-login',
  imports: [LandingHeader, LoginForm, LandingFooter],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {}
