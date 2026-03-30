import { Component } from '@angular/core';
import { DashboardButton } from "../../shared/buttons/dashboard-button/dashboard-button";

@Component({
  selector: 'app-user-dashboard',
  imports: [DashboardButton],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.scss',
})
export class UserDashboard {

}
