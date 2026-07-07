import { Component, inject, input, OnInit, signal } from '@angular/core';
import { UserPanelHeader } from '../../shared/headers/user-panel-header/user-panel-header';
import { UserPanelFooter } from '../../shared/footers/user-panel-footer/user-panel-footer';
import { IconTextButton } from '../../shared/buttons/icon-text-button/icon-text-button';
import { DashboardButton } from '../../shared/buttons/dashboard-button/dashboard-button';
import { Router } from '@angular/router';
import { Infinity } from '../../shared/loading/infinity/infinity';
import { UserService } from '../../core/services/user.service';
import { firstValueFrom } from 'rxjs';
import { UserData } from '../../core/models/userdata.model';
import { HumanDesignForm } from '../../shared/forms/human-design-form/human-design-form';
import { NumerologyForm } from '../../shared/forms/numerology-form/numerology-form';
import { AstrologyForm } from '../../shared/forms/astrology-form/astrology-form';
import { PerfectPlainTrigger } from '../../shared/perfect-plain-trigger/perfect-plain-trigger';
import { FormModal } from '../../shared/modal/form-modal/form-modal';

type PanelModal = 'human-design' | 'numerology' | 'astrology' | 'perfect-plain';

@Component({
  selector: 'app-user-supply-details',
  imports: [
    UserPanelHeader,
    UserPanelFooter,
    IconTextButton,
    DashboardButton,
    Infinity,
    FormModal,
    HumanDesignForm,
    NumerologyForm,
    AstrologyForm,
    PerfectPlainTrigger,
  ],
  templateUrl: './user-supply-details.html',
  styleUrl: './user-supply-details.scss',
})
export class UserSupplyDetails implements OnInit {
  async ngOnInit() {
    await this.getUserById(this.maestraId());
  }
  maestraId = input.required<string>();
  router = inject(Router);
  service = inject(UserService);
  userData = signal<UserData | null>(null);
  isLoading = signal(false);

  readonly openModal = signal<PanelModal | null>(null);

  async getUserById(id: string) {
    this.isLoading.set(true);
    try {
      const user = await firstValueFrom(this.service.findUserById(id));
      this.userData.set(user);
    } catch (e) {
      console.error(e);
    } finally {
      this.isLoading.set(false);
    }
  }
}
