import { Component } from '@angular/core';

@Component({
  selector: 'app-user-header-menu',
  imports: [],
  templateUrl: './user-header-menu.html',
  styleUrl: './user-header-menu.scss',
})
export class UserHeaderMenu {
  hrItems = Array(3).fill(0);
}
