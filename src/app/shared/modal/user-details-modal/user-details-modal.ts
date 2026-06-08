import { Component, inject, input, output, signal } from '@angular/core';
import { UserData } from '../../../core/models/userdata.model';
import { IconTextButton } from '../../buttons/icon-text-button/icon-text-button';
import { Router } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-user-details-modal',
  imports: [IconTextButton],
  templateUrl: './user-details-modal.html',
  styleUrl: './user-details-modal.scss',
})
export class UserDetailsModal {
  private readonly userService = inject(UserService);
  isLoading = signal(false);
  managerId = input.required<string>();
  userData = input.required<UserData>();
  isOpen = input<boolean>(false);
  close = output();
  router = inject(Router);

  onClose() {
    this.close.emit();
  }

  async deleteUser() {
    this.isLoading.set(true);
    try {
      if (!this.userData()) {
        alert('ID do usuário não encontrado.');
        throw new Error('UserData está indefinido.');
      }
      const deleted = await firstValueFrom(this.userService.deleteUser(this.userData().id!)) ;
      alert(`${deleted.fullName} foi excluída com sucesso`);
    } catch (e) {
      console.error(e);
      if(e instanceof HttpErrorResponse){
        alert(e.error.message);
      }
    } finally {
      this.isLoading.set(false);
      this.close.emit()
    }
  }
}
