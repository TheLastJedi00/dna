import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { UserPanelHeader } from '../../shared/headers/user-panel-header/user-panel-header';
import { ManagerHeader } from '../../shared/headers/manager-header/manager-header';
import { UserPanelFooter } from '../../shared/footers/user-panel-footer/user-panel-footer';
import { PanelCard } from '../../shared/cards/panel-card/panel-card';
import { LoginService } from '../../core/services/login-service';
import { Router } from '@angular/router';
import { UserRole } from '../../types/types';
import { UserData } from '../../core/models/userdata.model';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../../core/services/user-service';
import { Infinity } from '../../shared/loading/infinity/infinity';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  imports: [UserPanelHeader, ManagerHeader, UserPanelFooter, PanelCard, Infinity],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private readonly loginService = inject(LoginService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  isLoading = signal(false);
  userId = input();
  userData = signal<UserData | null>(null);
  roles = signal<UserRole[]>([]);
  firstRole = computed(() => this.roles().find((r) => r === 'MANAGER' || r === 'ADMIN'));

  async ngOnInit() {
    await this.getCurrentUserData();
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

  async getCurrentUserData() {
    this.isLoading.set(true)
    try {
      const decoded = this.loginService.getDecodedToken();
      if (!decoded) {
        throw new HttpErrorResponse({error: {message: 'Credenciais inválidas'}})
      }
      this.roles.set(decoded.roles);
      const user = await firstValueFrom(this.userService.getUserById(decoded.id));
      this.userData.set(user);
    } catch (e) {
      if (e instanceof HttpErrorResponse) {
        alert(e.error.message);
      }
      console.error(e);
    } finally {
      this.isLoading.set(false)
    }
  }
}
