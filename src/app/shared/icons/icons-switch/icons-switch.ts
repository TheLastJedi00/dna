import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgClass } from '@angular/common';

/**
 * Componente único de ícone: renderiza um SVG (Heroicons) escolhido por `icon`.
 * `customClass` permite estilizar (tamanho, cor, rotação). Substitui os 27
 * componentes de ícone individuais.
 */
@Component({
  selector: 'app-icons-switch',
  imports: [NgClass],
  templateUrl: './icons-switch.html',
  styleUrl: './icons-switch.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconsSwitch {
  icon = input('heart');
  customClass = input('');
}
