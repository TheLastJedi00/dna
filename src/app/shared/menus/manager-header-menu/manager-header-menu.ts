import { Component, input, output } from '@angular/core';
import { TextButton } from "../../buttons/text-button/text-button";
import { LogoutButton } from "../../buttons/logout-button/logout-button";
import { NgClass } from '@angular/common';
import { Role } from '../../../core/models/userdata.model';

@Component({
  selector: 'app-manager-header-menu',
  imports: [TextButton, LogoutButton, NgClass],
  templateUrl: './manager-header-menu.html',
  styleUrl: './manager-header-menu.scss',
})
export class ManagerHeaderMenu {
  hrItems = Array(3).fill(0);
  toggle = false;
  logout = output<void>();
  role = input<Role|undefined>(undefined)
  toggleMenu() {
    this.toggle = !this.toggle;
  }

  onLogout() {
    this.logout.emit();
  }
}
