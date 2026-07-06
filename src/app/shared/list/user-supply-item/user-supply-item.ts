import { Component, inject, input, output } from '@angular/core';
import { UserData } from '../../../core/models/userdata.model';
import { IconTextButton } from "../../buttons/icon-text-button/icon-text-button";
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-supply-item',
  imports: [IconTextButton],
  templateUrl: './user-supply-item.html',
  styleUrl: './user-supply-item.scss',
})
export class UserSupplyItem {
  router = inject(Router)
  userData = input.required<UserData>()
  index = input.required<number>()
  click = output()

  onClick(){
    this.click.emit()
  }
}
