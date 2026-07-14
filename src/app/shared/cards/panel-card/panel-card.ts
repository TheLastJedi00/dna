import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DashboardButton } from '../../buttons/dashboard-button/dashboard-button';
import { LoginService } from '../../../core/services/login.service';
import { UserRole } from '../../../types/types';
import { Router } from '@angular/router';

@Component({
  selector: 'app-panel-card',
  imports: [DashboardButton],
  templateUrl: './panel-card.html',
  styleUrl: './panel-card.scss',
})
export class PanelCard implements OnInit {
  readonly loginService = inject(LoginService);
  roles = signal<UserRole[]>([]);
  router = inject(Router);

  /** Gestão de Maestras: Analista também cadastra e acompanha as suas. */
  canManageMaestras = computed(() =>
    this.roles().some((role) => role !== 'USER'),
  );

  /** Gestão de Analistas: só ADMIN e MANAGER (espelha o managerGuard). */
  canManageAnalysts = computed(() =>
    this.roles().some((role) => role === 'ADMIN' || role === 'MANAGER'),
  );

  ngOnInit(): void {
    const role = this.loginService.getUserRole();
    if (role) {
      this.roles.set(role);
    }
  }
}
