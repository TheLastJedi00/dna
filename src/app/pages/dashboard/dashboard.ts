import { Component, inject, OnInit } from '@angular/core';
import { UserPanelHeader } from '../../shared/headers/user-panel-header/user-panel-header';
import { UserPanelFooter } from '../../shared/footers/user-panel-footer/user-panel-footer';
import { PanelCard } from '../../shared/cards/panel-card/panel-card';
import { CurrentUserService } from '../../core/services/current-user.service';
import { Skeleton } from '../../shared/feedback/skeleton/skeleton';
import { LoadError } from '../../shared/feedback/load-error/load-error';
import { NgTemplateOutlet } from '@angular/common';
import { LoginService } from '../../core/services/login.service';
import { VerifyEmailModal } from '../../shared/modal/verify-email-modal/verify-email-modal';

@Component({
  selector: 'app-dashboard',
  imports: [
    UserPanelHeader,
    UserPanelFooter,
    PanelCard,
    Skeleton,
    LoadError,
    NgTemplateOutlet,
    VerifyEmailModal,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  /** Mesmo perfil do menu lateral — uma única chamada a `/users/me` por sessão. */
  readonly currentUser = inject(CurrentUserService);
  /** Sem e-mail confirmado, o popup de verificação cobre o painel (spec 010). */
  readonly login = inject(LoginService);

  ngOnInit() {
    this.currentUser.ensureLoaded();
  }
}
