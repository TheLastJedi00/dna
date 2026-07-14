import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IconTextButton } from '../../buttons/icon-text-button/icon-text-button';
import { UserData } from '../../../core/models/userdata.model';

/**
 * Cartão da Maestra na listagem. Dumb: o modal de detalhe deixou de morar aqui
 * (spec 005) — o detalhe precisa de um `GET /users/:id` ao abrir, e isso é da
 * página smart. Aqui só se avisa qual Maestra foi escolhida.
 */
@Component({
  selector: 'app-detailed-item',
  imports: [IconTextButton],
  templateUrl: './detailed-item.html',
  styleUrl: './detailed-item.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailedItem {
  data = input.required<UserData>();
  select = output<UserData>();
}
