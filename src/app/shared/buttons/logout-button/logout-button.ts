import { Component, output } from '@angular/core';
import { Exit } from '../../icons/exit/exit';

@Component({
  selector: 'app-logout-button',
  imports: [Exit],
  templateUrl: './logout-button.html',
  styleUrl: './logout-button.scss',
})
export class LogoutButton {
  navigateTo = output<void>();

  onClick() {
    this.navigateTo.emit();
  }
}
