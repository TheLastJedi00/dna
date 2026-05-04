import { Component, inject, OnInit, signal } from '@angular/core';
import { ManagerHeader } from '../../shared/headers/manager-header/manager-header';
import { Router } from '@angular/router';
import { FakeApi } from '../../core/services/fake-api';
import { UserData } from '../../core/models/userdata.model';
import { DashboardButton } from "../../shared/buttons/dashboard-button/dashboard-button";
import { UserPanelFooter } from "../../shared/footers/user-panel-footer/user-panel-footer";

@Component({
  selector: 'app-manager-dashboard',
  imports: [ManagerHeader, DashboardButton, UserPanelFooter],
  templateUrl: './manager-dashboard.html',
  styleUrl: './manager-dashboard.scss',
})
export class ManagerDashboard implements OnInit{
  ngOnInit(): void {
    this.user.set(this.api.getUserData());
  }
  user = signal<UserData|null>(null)
  api = inject(FakeApi)
  router = inject(Router);

  onLogout() {
    this.router.navigate(['/login']);
  }
}
