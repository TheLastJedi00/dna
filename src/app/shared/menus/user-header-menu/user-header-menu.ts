import { Component, output } from '@angular/core';
import { NgClass } from "@angular/common";
import { TextButton } from "../../buttons/text-button/text-button";
import { LogoutButton } from '../../buttons/logout-button/logout-button'; 

@Component({
  selector: 'app-user-header-menu',
  imports: [NgClass, TextButton, LogoutButton],
  templateUrl: './user-header-menu.html',
  styleUrl: './user-header-menu.scss',
})
export class UserHeaderMenu {
  hrItems = Array(3).fill(0);
  toggle = false;

  toggleMenu() {
    this.toggle = !this.toggle;
  }

}
