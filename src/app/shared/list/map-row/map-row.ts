import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IconsSwitch } from '../../icons/icons-switch/icons-switch';

/**
 * Linha do "mapa" dos dashboards (spec 010): imagem redonda ou ícone, título,
 * subtítulo em ouro, descrição e chevron. Os dashboards de usuário e de gestão
 * usam a mesma linha, num painel branco — em vez de cards soltos.
 * Referência visual: `.claude/specs/010 - …/preview.html`.
 */
@Component({
  selector: 'app-map-row',
  imports: [IconsSwitch],
  templateUrl: './map-row.html',
  styleUrl: './map-row.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapRow {
  title = input.required<string>();
  kicker = input<string>('');
  description = input<string>('');
  /** Imagem do pilar; sem ela, usa `icon`. */
  imgSrc = input<string>('');
  icon = input<string>('');
  /** Linha menor, para "Sua conta". */
  compact = input<boolean>(false);
  action = output<void>();
}
