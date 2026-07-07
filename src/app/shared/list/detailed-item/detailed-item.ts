import { Component, input, signal } from '@angular/core';
import { IconTextButton } from '../../buttons/icon-text-button/icon-text-button';
import { UserDetailsModal } from '../../modal/user-details-modal/user-details-modal';
import { UserData } from '../../../core/models/userdata.model';

@Component({
  selector: 'app-detailed-item',
  imports: [IconTextButton, UserDetailsModal],
  templateUrl: './detailed-item.html',
  styleUrl: './detailed-item.scss',
})
export class DetailedItem {
  data = input.required<UserData>();
  isModalOpen = signal<boolean>(false);

  openModal() {
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }
}
