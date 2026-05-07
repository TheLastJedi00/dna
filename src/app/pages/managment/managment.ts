import { Component, input } from '@angular/core';
import { UserPanelHeader } from "../../shared/headers/user-panel-header/user-panel-header";

@Component({
  selector: 'app-managment',
  imports: [UserPanelHeader],
  templateUrl: './managment.html',
  styleUrl: './managment.scss',
})
export class Managment {
  type = input<string>('')
}
