import { Component, inject, input, OnInit, signal } from '@angular/core';
import { UserPanelHeader } from '../../shared/headers/user-panel-header/user-panel-header';
import { UserPanelFooter } from '../../shared/footers/user-panel-footer/user-panel-footer';
import { IconTextButton } from '../../shared/buttons/icon-text-button/icon-text-button';
import { Router } from '@angular/router';
import { Infinity } from '../../shared/loading/infinity/infinity';
import { UserService } from '../../core/services/user.service';
import { firstValueFrom } from 'rxjs';
import { UserData } from '../../core/models/userdata.model';
import { HttpErrorResponse } from '@angular/common/http';
import { HumanDesignForm } from '../../shared/forms/human-design-form/human-design-form';

@Component({
  selector: 'app-user-supply-details',
  imports: [UserPanelHeader, UserPanelFooter, IconTextButton, Infinity, HumanDesignForm],
  templateUrl: './user-supply-details.html',
  styleUrl: './user-supply-details.scss',
})
export class UserSupplyDetails implements OnInit {
  async ngOnInit() {
    await this.getUserById(this.maestraId());
  }
  userId = input.required<string>();
  maestraId = input.required<string>();
  router = inject(Router);
  service = inject(UserService);
  userData = signal<UserData | null>(null);
  isLoading = signal(false);

  async getUserById(id: string) {
    this.isLoading.set(true);
    try {
      const user = await firstValueFrom(this.service.findUserById(id));
      this.userData.set(user);
    } catch (e) {
      if (e instanceof HttpErrorResponse) {
        alert(e.error.message);
      }
      console.error(e);
    } finally {
      this.isLoading.set(false);
    }
  }
}
