import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-panel-footer',
  imports: [],
  templateUrl: './user-panel-footer.html',
  styleUrl: './user-panel-footer.scss',
})
export class UserPanelFooter {
  router = inject(Router)

  navigateTo(url: string){
    this.router.navigate([`${url}`]);
  }
}
