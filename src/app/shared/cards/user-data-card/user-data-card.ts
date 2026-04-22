import { Component, inject, OnInit, signal } from '@angular/core';
import { FakeApi } from '../../../core/services/fake-api';
import { UserData } from '../../../core/models/userdata.model';

@Component({
  selector: 'app-user-data-card',
  imports: [],
  templateUrl: './user-data-card.html',
  styleUrl: './user-data-card.scss',
})
export class UserDataCard implements OnInit {
  ngOnInit(): void {
    this.userData.set(this.api.getUserData());
  }
  api = inject(FakeApi);
  userData = signal<UserData | null>(null);
}
