import { Component, inject, input, output } from '@angular/core';
import { Logo } from '../../logo/logo';
import { ManagerHeaderMenu } from '../../menus/manager-header-menu/manager-header-menu';
import { Router } from '@angular/router';
import { Role } from '../../../core/models/userdata.model';

@Component({
  selector: 'app-manager-header',
  imports: [Logo, ManagerHeaderMenu],
  templateUrl: './manager-header.html',
  styleUrl: './manager-header.scss',
})
export class ManagerHeader {
  router = inject(Router);
  logout = output<void>();
  role  = input<Role|undefined>(undefined)
  onLogout() {
    this.logout.emit();
  }

  returnToHome() {
    this.router.navigate(['/dashboard']);
  }
}
