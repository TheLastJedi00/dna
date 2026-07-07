import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../../core/services/login.service';

@Component({
  selector: 'app-user-panel-footer',
  imports: [],
  templateUrl: './user-panel-footer.html',
  styleUrl: './user-panel-footer.scss',
})
export class UserPanelFooter {
  router = inject(Router);
  loginservice = inject(LoginService)

  private readonly pillars = ['human-design', 'numerology', 'astrology'];

  navigateTo(url: string) {
    if (this.pillars.includes(url)) {
      this.router.navigate([`${url}/${this.loginservice.userId}`]);
    } else {
      this.router.navigate([url]);
    }
  }

  logout() {
    this.loginservice.logout();
    this.router.navigate(['login']);
  }
}
