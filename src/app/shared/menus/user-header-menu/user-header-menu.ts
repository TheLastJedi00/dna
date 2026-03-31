import { Component } from '@angular/core';
import { NgClass } from "@angular/common";

@Component({
  selector: 'app-user-header-menu',
  imports: [NgClass],
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
