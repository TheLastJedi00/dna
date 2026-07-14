import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { UserData } from '../../../core/models/userdata.model';
import { IconTextButton } from '../../buttons/icon-text-button/icon-text-button';
import { TempPasswordForm } from '../../forms/temp-password-form/temp-password-form';
import { Infinity } from '../../loading/infinity/infinity';

/**
 * Detalhe da Maestra: dados, quem a cadastrou, credenciais e as ações.
 *
 * Dumb (spec 005): não injeta mais `UserService` nem `Router` — só emite a
 * intenção. Quem busca o detalhe (`GET /users/:id`, único lugar de onde vem a
 * senha provisória) e executa as ações é a page `management`.
 */
@Component({
  selector: 'app-user-details-modal',
  imports: [IconTextButton, TempPasswordForm, Infinity],
  templateUrl: './user-details-modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailsModal {
  userData = input.required<UserData>();
  isOpen = input<boolean>(false);
  isLoading = input<boolean>(false);

  close = output<void>();
  edit = output<void>();
  disable = output<void>();
  reactivate = output<void>();
  openSupply = output<void>();
  generateTempPassword = output<string>();
}
