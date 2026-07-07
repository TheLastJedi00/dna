import { Component, inject } from '@angular/core';
import { IconsSwitch } from '../../icons/icons-switch/icons-switch';
import { Router } from '@angular/router';
import { LoginService } from '../../../core/services/login.service';

@Component({
  selector: 'app-logout-button',
  imports: [IconsSwitch],
  templateUrl: './logout-button.html',
  styleUrl: './logout-button.scss',
})
export class LogoutButton {
  private readonly router = inject(Router);
  private readonly loginService = inject(LoginService);

  logout() {
    this.loginService.logout();
    this.router.navigate(['login']);
  }
}
