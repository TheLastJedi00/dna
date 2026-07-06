import { Component, inject, input, signal } from '@angular/core';
import { UserPanelHeader } from "../../shared/headers/user-panel-header/user-panel-header";
import { DetailedList } from '../../shared/list/detailed-list/detailed-list';
import { IconTextButton } from "../../shared/buttons/icon-text-button/icon-text-button";
import { Router } from '@angular/router';
import { UserPanelFooter } from "../../shared/footers/user-panel-footer/user-panel-footer";
import { UserContextService } from '../../core/services/user-context.service';

@Component({
  selector: 'app-management',
  imports: [UserPanelHeader, DetailedList, IconTextButton, UserPanelFooter],
  templateUrl: './management.html',
  styleUrl: './management.scss',
})
export class Management {
  router = inject(Router)
  readonly userContext = inject(UserContextService)
  type = input.required<string>()
  reloadList = signal(false)
}
