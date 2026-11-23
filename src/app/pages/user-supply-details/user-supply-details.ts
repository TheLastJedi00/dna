import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { UserPanelHeader } from '../../shared/headers/user-panel-header/user-panel-header';
import { UserPanelFooter } from '../../shared/footers/user-panel-footer/user-panel-footer';
import { IconTextButton } from '../../shared/buttons/icon-text-button/icon-text-button';
import { DashboardButton } from '../../shared/buttons/dashboard-button/dashboard-button';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { loadState } from '../../core/utils/load-state';
import { Skeleton } from '../../shared/feedback/skeleton/skeleton';
import { LoadError } from '../../shared/feedback/load-error/load-error';
import { HumanDesignForm } from '../../shared/forms/human-design-form/human-design-form';
import { NumerologyForm } from '../../shared/forms/numerology-form/numerology-form';
import { AstrologyForm } from '../../shared/forms/astrology-form/astrology-form';
import { PerfectPlainTrigger } from '../../shared/perfect-plain-trigger/perfect-plain-trigger';
import { FormModal } from '../../shared/modal/form-modal/form-modal';
import { maestraLabel } from '../../core/utils/pronoun';

type PanelModal = 'human-design' | 'numerology' | 'astrology' | 'perfect-plain';

@Component({
  selector: 'app-user-supply-details',
  imports: [
    UserPanelHeader,
    UserPanelFooter,
    IconTextButton,
    DashboardButton,
    Skeleton,
    LoadError,
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
  /** Id do usuário (parâmetro `:userId` da rota). */
  userId = input.required<string>();
  router = inject(Router);
  service = inject(UserService);

  /** Cabeçalho da Maestra: skeleton enquanto carrega, erro inline se falhar. */
  readonly user = loadState(() => this.service.findUserById(this.userId()));
  readonly userData = computed(() => this.user.data());

  /** "Maestra"/"Maestro" conforme o pronome escolhido no cadastro. */
  readonly maestraTerm = computed(() => maestraLabel(this.userData()?.pronoun));

  readonly openModal = signal<PanelModal | null>(null);

  ngOnInit() {
    this.user.load();
  }
}
