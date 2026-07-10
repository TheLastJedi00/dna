import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import { IconTextButton } from '../../buttons/icon-text-button/icon-text-button';
import { UserDetailsModal } from '../../modal/user-details-modal/user-details-modal';
import { UserData } from '../../../core/models/userdata.model';

@Component({
  selector: 'app-detailed-item',
  imports: [IconTextButton, UserDetailsModal],
  templateUrl: './detailed-item.html',
  styleUrl: './detailed-item.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailedItem {
  data = input.required<UserData>();
  changed = output<void>();
  isModalOpen = signal<boolean>(false);

  openModal() {
    this.isModalOpen.set(true);
  }

  onModalClosed(changed: boolean) {
    this.isModalOpen.set(false);
    if (changed) this.changed.emit();
  }
}
