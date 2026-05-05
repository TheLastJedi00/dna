import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { UserPanelHeader } from '../../shared/headers/user-panel-header/user-panel-header';
import { ManagerHeader } from '../../shared/headers/manager-header/manager-header';
import { UserPanelFooter } from '../../shared/footers/user-panel-footer/user-panel-footer';
import { PanelCard } from '../../shared/cards/panel-card/panel-card';
import { Login } from '../../core/services/login';
import { Router } from '@angular/router';
import { UserRole } from '../../types/types';

@Component({
  selector: 'app-dashboard',
  imports: [UserPanelHeader, ManagerHeader, UserPanelFooter, PanelCard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private readonly loginService = inject(Login);
  private readonly router = inject(Router);

  roles = signal<UserRole[]>([]);
  userName = signal('');
  firstRole = computed(() => this.roles().find(r => r === 'MANAGER' || r === 'ADMIN'));

  ngOnInit(): void {
    const decoded = this.loginService.getDecodedToken();
    if (decoded) {
      this.roles.set(decoded.roles);
      this.userName.set(decoded.name ?? '');
    }
  }

  isUser(): boolean {
    return this.roles().includes('USER');
  }

  isAdminOrManager(): boolean {
    return this.roles().includes('ADMIN') || this.roles().includes('MANAGER');
  }

  onLogout() {
    localStorage.removeItem('access_token');
    this.router.navigate(['/login']);
  }
}
