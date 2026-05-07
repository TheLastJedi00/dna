import { Component, inject, OnInit, signal } from '@angular/core';
import { DashboardButton } from '../../buttons/dashboard-button/dashboard-button';
import { LoginService } from '../../../core/services/login-service';
import { UserRole } from '../../../types/types';
import { Router } from '@angular/router';

@Component({
  selector: 'app-panel-card',
  imports: [DashboardButton],
  templateUrl: './panel-card.html',
  styleUrl: './panel-card.scss',
})
export class PanelCard implements OnInit {
  private readonly loginService = inject(LoginService);
  roles = signal<UserRole[]>([]);
  router = inject(Router)

  navigateTo(url:  string){
    this.router.navigate([url])
  }

  ngOnInit(): void {
    const role = this.loginService.getUserRole();
    if (role) {
      this.roles.set(role);
    }
  }
}
