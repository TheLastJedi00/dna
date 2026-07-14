import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IconTextButton } from '../../buttons/icon-text-button/icon-text-button';
import { Infinity } from '../../loading/infinity/infinity';
import { AnalystData, LinkedMaestra } from '../../../core/models/analyst.model';

/**
 * Detalhe do Analista: ações (editar/desativar/reativar) e supervisão da
 * carteira dele. A seção "Maestras Vinculadas" é só leitura — nome e status,
 * sem ação e sem link para o detalhe: o Manager supervisiona o trabalho do
 * Analista, mas não acessa os dados pessoais das clientes dele.
 *
 * Dumb: recebe as Maestras já carregadas e só emite a intenção das ações; a
 * página smart chama o AnalystService.
 */
@Component({
  selector: 'app-analyst-details-modal',
  imports: [IconTextButton, Infinity],
  templateUrl: './analyst-details-modal.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalystDetailsModal {
  analyst = input.required<AnalystData>();
  isOpen = input<boolean>(false);
  maestras = input<LinkedMaestra[]>([]);
  isLoadingMaestras = input<boolean>(false);

  close = output<void>();
  edit = output<void>();
  disable = output<void>();
  reactivate = output<void>();
}
