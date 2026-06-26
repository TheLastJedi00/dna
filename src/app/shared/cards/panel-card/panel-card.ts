import { Component, inject, OnInit, signal } from '@angular/core';
import { DashboardButton } from '../../buttons/dashboard-button/dashboard-button';
import { LoginService } from '../../../core/services/login.service';
import { UserRole } from '../../../types/types';
import { Router } from '@angular/router';
import { UserContextService } from '../../../core/services/user-context.service';

@Component({
  selector: 'app-panel-card',
  imports: [DashboardButton],
  templateUrl: './panel-card.html',
  styleUrl: './panel-card.scss',
})
export class PanelCard implements OnInit {
  private readonly loginService = inject(LoginService);
  readonly userContext = inject(UserContextService);
  roles = signal<UserRole[]>([]);
  router = inject(Router);

  ngOnInit(): void {
    const role = this.loginService.getUserRole();
    if (role) {
      this.roles.set(role);
    }
  }
}
