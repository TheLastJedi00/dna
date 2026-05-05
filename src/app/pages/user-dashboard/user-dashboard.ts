import { Component, inject } from '@angular/core';
import { UserPanelHeader } from "../../shared/headers/user-panel-header/user-panel-header";
import { Router } from '@angular/router';
import { UserPanelFooter } from "../../shared/footers/user-panel-footer/user-panel-footer";
import { PanelCard } from "../../shared/cards/panel-card/panel-card";

@Component({
  selector: 'app-user-dashboard',
  imports: [UserPanelHeader, UserPanelFooter, PanelCard],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.scss',
})
export class UserDashboard {
  router = inject(Router);

  onLogout() {
    this.router.navigate(['/login']);
  }

}
