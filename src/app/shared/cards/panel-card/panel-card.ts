import { Component, inject, OnInit, signal } from '@angular/core';
import { DashboardButton } from "../../buttons/dashboard-button/dashboard-button";
import { navigateTo } from '../../../utils/utilities';
import { Login } from '../../../core/services/login';
import { UserRole } from '../../../types/types';

@Component({
  selector: 'app-panel-card',
  imports: [DashboardButton],
  templateUrl: './panel-card.html',
  styleUrl: './panel-card.scss',
})
export class PanelCard implements OnInit {
  private readonly loginService = inject(Login)
  roles = signal<UserRole[]>([])
  navigateTo = navigateTo;

  ngOnInit(): void {
    const role = this.loginService.getUserRole()
    if(role){
      this.roles.set(role)
    }
  }

}
