import { Component, inject } from '@angular/core';
import { DashboardButton } from "../../shared/buttons/dashboard-button/dashboard-button";
import { UserPanelHeader } from "../../shared/headers/user-panel-header/user-panel-header";
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  imports: [DashboardButton, UserPanelHeader],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.scss',
})
export class UserDashboard {
  router = inject(Router);

  onLogout() {
    this.router.navigate(['/login']);
  }
}
