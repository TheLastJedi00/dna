import { Component, inject, input } from '@angular/core';
import { UserPanelHeader } from "../../shared/headers/user-panel-header/user-panel-header";
import { DetailedList } from '../../shared/list/detailed-list/detailed-list';
import { IconTextButton } from "../../shared/buttons/icon-text-button/icon-text-button";
import { Router } from '@angular/router';
import { NewUserForm } from "../../shared/forms/new-user-form/new-user-form";

@Component({
  selector: 'app-managment',
  imports: [UserPanelHeader, DetailedList, IconTextButton, NewUserForm],
  templateUrl: './managment.html',
  styleUrl: './managment.scss',
})
export class Managment {
  router = inject(Router)
  userId = input.required<string>()
  type = input.required<string>()
}
