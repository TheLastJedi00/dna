import { Component, input, output } from '@angular/core';
import { FlatButton } from '../../buttons/flat-button/flat-button';
import { Logo } from '../../logo/logo';

@Component({
  selector: 'app-login-form',
  imports: [FlatButton, Logo],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export class LoginForm {
  disableButton = input<boolean>(false);
  disableEmailInput = input<boolean>(false);
  disablePasswordInput = input<boolean>(false);
  navigateToRegisterUser = output<void>();
  navigateToRegisterAdmin = output<void>();
  onLogin() {
    this.navigateToRegisterUser.emit();
  }
  onAdminLogin(){
    this.navigateToRegisterAdmin.emit();
  }
}
