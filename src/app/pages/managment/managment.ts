import { Component, inject, input, signal } from '@angular/core';
import { UserPanelHeader } from "../../shared/headers/user-panel-header/user-panel-header";
import { DetailedList } from '../../shared/list/detailed-list/detailed-list';
import { IconTextButton } from "../../shared/buttons/icon-text-button/icon-text-button";
import { Router } from '@angular/router';

@Component({
  selector: 'app-managment',
  imports: [UserPanelHeader, DetailedList, IconTextButton],
  templateUrl: './managment.html',
  styleUrl: './managment.scss',
})
export class Managment {
  router = inject(Router)
  userId = input.required<string>()
  type = input.required<string>()
  reloadList = signal(false)
}
