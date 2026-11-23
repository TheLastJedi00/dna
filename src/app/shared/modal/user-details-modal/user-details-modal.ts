import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { UserData } from '../../../core/models/userdata.model';
import { pronounLabel, userSubject } from '../../../core/utils/pronoun';
import { IconTextButton } from '../../buttons/icon-text-button/icon-text-button';
import { AccessStatusCard } from '../../cards/access-status/access-status';
import { Skeleton } from '../../feedback/skeleton/skeleton';
import { LoadError } from '../../feedback/load-error/load-error';

/**
 * Detalhe da Maestra: dados, quem a cadastrou, credenciais e as ações.
 *
 * Dumb: não injeta `UserService` nem `Router` — só emite a intenção. Quem
 * busca o detalhe (`GET /users/:id`, único lugar com o status do acesso) e
 * executa as ações é a page `management`.
 */
@Component({
  selector: 'app-user-details-modal',
  imports: [IconTextButton, AccessStatusCard, Skeleton, LoadError],
  templateUrl: './user-details-modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailsModal {
  userData = input.required<UserData>();
  isOpen = input<boolean>(false);
  /** Detalhe (`GET /users/:id`) em voo: e-mail e credenciais em skeleton. */
  isLoading = input<boolean>(false);
  /** Falha ao buscar o detalhe; o modal mostra o erro no lugar das credenciais. */
  error = input<string | null>(null);

  /** "o usuário" / "a usuária" — sujeito das frases da senha provisória. */
  readonly subject = computed(() => userSubject(this.userData().pronoun));
  /** "Masculino" / "Feminino" — o pronome como rótulo legível. */
  readonly pronounText = computed(() => pronounLabel(this.userData().pronoun));

  close = output<void>();
  edit = output<void>();
  disable = output<void>();
  reactivate = output<void>();
  openSupply = output<void>();
  /** Reenviar o convite "Defina sua senha" (spec 010). */
  resendInvite = output<void>();
  /** Reenvio em andamento. */
  isResending = input<boolean>(false);
  /** Tentar buscar o detalhe de novo. */
  retry = output<void>();
}
