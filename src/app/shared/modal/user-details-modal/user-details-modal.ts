import { Component, inject, input, output, signal } from '@angular/core';
import { UserData } from '../../../core/models/userdata.model';
import { IconTextButton } from '../../buttons/icon-text-button/icon-text-button';
import { Router } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
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
  userData = input.required<UserData>();
  isOpen = input<boolean>(false);
  // Emite `true` quando houve mudança (desativou/reativou/editou) para a lista
  // recarregar; `false` quando o modal só foi fechado.
  close = output<boolean>();
  router = inject(Router);

  onClose() {
    this.close.emit(false);
  }

  async deleteUser() {
    this.isLoading.set(true);
    try {
      await firstValueFrom(this.userService.deleteUser(this.userData().id!));
      this.close.emit(true);
    } catch {
      // erro HTTP exibido pelo errorInterceptor global
    } finally {
      this.isLoading.set(false);
    }
  }
}
