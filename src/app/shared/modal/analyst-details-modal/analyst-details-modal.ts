import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IconTextButton } from '../../buttons/icon-text-button/icon-text-button';
import { AccessStatusCard } from '../../cards/access-status/access-status';
import { Skeleton } from '../../feedback/skeleton/skeleton';
import { LoadError } from '../../feedback/load-error/load-error';
import { AnalystData, LinkedUser } from '../../../core/models/analyst.model';

/**
 * Detalhe do Analista: ações (editar/desativar/reativar) e supervisão da
 * carteira dele. A seção "Usuários vinculados" é só leitura — nome e status,
 * sem ação e sem link para o detalhe: o Manager supervisiona o trabalho do
 * Analista, mas não acessa os dados pessoais das clientes dele.
 *
 * Dumb: recebe os usuários já carregados e só emite a intenção das ações; a
 * página smart chama o AnalystService.
 */
@Component({
  selector: 'app-analyst-details-modal',
  imports: [IconTextButton, AccessStatusCard, Skeleton, LoadError],
  templateUrl: './analyst-details-modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalystDetailsModal {
  analyst = input.required<AnalystData>();
  isOpen = input<boolean>(false);
  linkedUsers = input<LinkedUser[]>([]);
  isLoadingLinkedUsers = input<boolean>(false);
  isLoadingDetails = input<boolean>(false);
  /** Falhas independentes: uma não esconde a outra parte do modal. */
  detailsError = input<string | null>(null);
  linkedUsersError = input<string | null>(null);

  close = output<void>();
  edit = output<void>();
  disable = output<void>();
  reactivate = output<void>();
  /** Reenviar o convite "Defina sua senha" (spec 010). */
  resendInvite = output<void>();
  /** Reenvio em andamento. */
  isResending = input<boolean>(false);
  retryDetails = output<void>();
  retryLinkedUsers = output<void>();
}
