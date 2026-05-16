import { Component, inject, output } from '@angular/core';
import { Exit } from '../../icons/exit/exit';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout-button',
  imports: [Exit],
  templateUrl: './logout-button.html',
  styleUrl: './logout-button.scss',
})
export class LogoutButton {
  router = inject(Router)

  logout(){
    this.router.navigate([`login`])
    localStorage.removeItem("access_token")
  }
}
