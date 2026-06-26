import { Component, inject } from '@angular/core';
import { NgClass } from "@angular/common";
import { TextButton } from "../../buttons/text-button/text-button";
import { LogoutButton } from '../../buttons/logout-button/logout-button'; 
import { LoginService } from '../../../core/services/login.service';
import { Router } from '@angular/router';
import { UserContextService } from '../../../core/services/user-context.service';

@Component({
  selector: 'app-user-header-menu',
  imports: [NgClass, TextButton, LogoutButton],
  templateUrl: './user-header-menu.html',
  styleUrl: './user-header-menu.scss',
})
export class UserHeaderMenu {
  hrItems = Array(3).fill(0);
  readonly userContext = inject(UserContextService);
  loginService = inject(LoginService)
  router = inject(Router)
  toggle = false;

  toggleMenu() {
    this.toggle = !this.toggle;
  }

}
