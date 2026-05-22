import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { LoginService } from '../../../core/services/login.service';

@Component({
  selector: 'app-user-panel-footer',
  imports: [],
  templateUrl: './user-panel-footer.html',
  styleUrl: './user-panel-footer.scss',
})
export class UserPanelFooter {
  userId = input('');
  router = inject(Router);
  loginservice = inject(LoginService)

  navigateTo(url: string) {
    if (url === 'human-design') {
      this.router.navigate([`human-design/${this.userId()}`]);
    } else {
      this.router.navigate([url]);
    }
  }
}
