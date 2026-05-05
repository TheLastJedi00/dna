import { Component, inject, output } from '@angular/core';
import { Logo } from "../../logo/logo";
import { UserHeaderMenu } from '../../menus/user-header-menu/user-header-menu';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-panel-header',
  imports: [Logo, UserHeaderMenu],
  templateUrl: './user-panel-header.html',
  styleUrl: './user-panel-header.scss',
})
export class UserPanelHeader {
  router = inject(Router);
  logout = output<void>();

  onLogout() {
    this.logout.emit();
  }

  returnToHome(){
    this.router.navigate(['/dashboard'])
  }
}
