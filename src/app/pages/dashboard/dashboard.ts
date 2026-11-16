import { Component, inject, OnInit } from '@angular/core';
import { UserPanelHeader } from '../../shared/headers/user-panel-header/user-panel-header';
import { UserPanelFooter } from '../../shared/footers/user-panel-footer/user-panel-footer';
import { PanelCard } from '../../shared/cards/panel-card/panel-card';
import { CurrentUserService } from '../../core/services/current-user.service';
import { Skeleton } from '../../shared/feedback/skeleton/skeleton';
import { LoadError } from '../../shared/feedback/load-error/load-error';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [UserPanelHeader, UserPanelFooter, PanelCard, Skeleton, LoadError, NgTemplateOutlet],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  /** Mesmo perfil do menu lateral — uma única chamada a `/users/me` por sessão. */
  readonly currentUser = inject(CurrentUserService);

  ngOnInit() {
    this.currentUser.ensureLoaded();
  }
}
