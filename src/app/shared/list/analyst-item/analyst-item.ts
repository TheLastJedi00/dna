import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IconTextButton } from '../../buttons/icon-text-button/icon-text-button';
import { AnalystData } from '../../../core/models/analyst.model';

/**
 * Cartão do Analista na listagem. Dumb: recebe o dado pronto e só avisa a página
 * (`select`) quando o Manager pede os detalhes — quem carrega a supervisão e
 * executa as ações é a página smart.
 */
@Component({
  selector: 'app-analyst-item',
  imports: [IconTextButton],
  templateUrl: './analyst-item.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalystItem {
  data = input.required<AnalystData>();
  select = output<AnalystData>();
}
