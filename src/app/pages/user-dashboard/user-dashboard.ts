import { Component } from '@angular/core';
import { DashboardButton } from "../../shared/buttons/dashboard-button/dashboard-button";
import { UserPanelHeader } from "../../shared/headers/user-panel-header/user-panel-header";

@Component({
  selector: 'app-user-dashboard',
  imports: [DashboardButton, UserPanelHeader],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.scss',
})
export class UserDashboard {

}
