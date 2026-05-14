import { Component, inject, input, output, signal } from '@angular/core';
import { UserData } from '../../../core/models/userdata.model';
import { IconTextButton } from "../../buttons/icon-text-button/icon-text-button";
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-details-modal',
  imports: [IconTextButton],
  templateUrl: './user-details-modal.html',
  styleUrl: './user-details-modal.scss',
})
export class UserDetailsModal {
  managerId = input.required<string>()
  userData = input.required<UserData>()
  isOpen = input<boolean>(false)
  close = output()
  router = inject(Router)

  onClose(){
    this.close.emit()
  }
}
