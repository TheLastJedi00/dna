import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DetailedItem } from '../detailed-item/detailed-item';
import { UserData } from '../../../core/models/userdata.model';

/**
 * Componente dumb: recebe a lista pronta (`users`) e reemite `changed` quando
 * um item sofre uma ação (desativar/reativar/editar), para a página smart
 * recarregar. Sem injeção de serviço/HTTP.
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
  changed = output<void>();
}
