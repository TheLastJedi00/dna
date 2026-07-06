import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { LoginService } from '../../../core/services/login.service';
import { UserContextService } from '../../../core/services/user-context.service';

@Component({
  selector: 'app-user-panel-footer',
  imports: [],
  templateUrl: './user-panel-footer.html',
  styleUrl: './user-panel-footer.scss',
})
export class UserPanelFooter {
  readonly userContext = inject(UserContextService);
  router = inject(Router);
  loginservice = inject(LoginService)

  private readonly pillars = ['human-design', 'numerology', 'astrology'];

  navigateTo(url: string) {
    if (this.pillars.includes(url)) {
      this.router.navigate([`${url}/${this.userContext.userId}`]);
    } else {
      this.router.navigate([url]);
    }
  }

  logout() {
    this.loginservice.logout();
    this.router.navigate(['login']);
  }
}
