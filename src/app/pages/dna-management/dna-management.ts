import { Component, inject } from '@angular/core';
import { UserPanelHeader } from "../../shared/headers/user-panel-header/user-panel-header";
import { UserPanelFooter } from "../../shared/footers/user-panel-footer/user-panel-footer";
import { IconTextButton } from "../../shared/buttons/icon-text-button/icon-text-button";
import { Router } from '@angular/router';
import { UserSupplyList } from '../../shared/list/user-supply-list/user-supply-list';

@Component({
  selector: 'app-dna-management',
  imports: [UserPanelHeader, UserPanelFooter, IconTextButton, UserSupplyList],
  templateUrl: './dna-management.html',
  styleUrl: './dna-management.scss',
})
export class DnaManagement {
  router = inject(Router)
}
