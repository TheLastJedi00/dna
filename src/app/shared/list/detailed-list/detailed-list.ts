import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DetailedItem } from '../detailed-item/detailed-item';
import { UserData } from '../../../core/models/userdata.model';

/**
 * Componente dumb: recebe a lista pronta (`users`) e repassa a Maestra escolhida
 * para a página smart, que busca o detalhe e executa as ações.
 */
@Component({
  selector: 'app-detailed-list',
  imports: [DetailedItem],
  templateUrl: './detailed-list.html',
  styleUrl: './detailed-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailedList {
  users = input<UserData[] | null>(null);
  select = output<UserData>();
}
