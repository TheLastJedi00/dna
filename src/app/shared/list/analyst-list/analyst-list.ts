import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AnalystItem } from '../analyst-item/analyst-item';
import { AnalystData } from '../../../core/models/analyst.model';

/**
 * Grade de Analistas. Dumb: recebe a página já pronta e repassa a seleção de um
 * item para a página smart. Sem injeção de serviço/HTTP.
 */
@Component({
  selector: 'app-analyst-list',
  imports: [AnalystItem],
  templateUrl: './analyst-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalystList {
  analysts = input<AnalystData[]>([]);
  select = output<AnalystData>();
}
