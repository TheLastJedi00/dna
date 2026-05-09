import { Component, input, output } from '@angular/core';
import { UserData } from '../../../core/models/userdata.model';
import { IconTextButton } from "../../buttons/icon-text-button/icon-text-button";

@Component({
  selector: 'app-user-details-modal',
  imports: [IconTextButton],
  templateUrl: './user-details-modal.html',
  styleUrl: './user-details-modal.scss',
})
export class UserDetailsModal {
  userData = input<UserData|null>(null)
  isOpen = input<boolean>(false)
  close = output()

  onClose(){
    this.close.emit()
  }
}
