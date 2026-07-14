import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IconTextButton } from '../../buttons/icon-text-button/icon-text-button';
import { AnalystData } from '../../../core/models/analyst.model';

/**
 * Detalhe do Analista e ponto de entrada das ações (editar/desativar/reativar).
 * Dumb: só emite a intenção; a página smart chama o AnalystService.
 */
@Component({
  selector: 'app-analyst-details-modal',
  imports: [IconTextButton],
  templateUrl: './analyst-details-modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalystDetailsModal {
  analyst = input.required<AnalystData>();
  isOpen = input<boolean>(false);

  close = output<void>();
  edit = output<void>();
  disable = output<void>();
  reactivate = output<void>();
}
