import { Component, input } from '@angular/core';
import { UserData } from '../../../core/models/userdata.model';

@Component({
  selector: 'app-user-data-card',
  imports: [],
  templateUrl: './user-data-card.html',
  styleUrl: './user-data-card.scss',
})
export class UserDataCard {
  userData = input.required<UserData>();
}
