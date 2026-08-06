import { Component, input, output } from '@angular/core';
import { IconsSwitch } from '../../icons/icons-switch/icons-switch';

@Component({
  selector: 'app-dashboard-button',
  imports: [IconsSwitch],
  templateUrl: './dashboard-button.html',
  styleUrl: './dashboard-button.scss',
})
export class DashboardButton {
  imgSrc = input<string>('imgSrc');
  // Quando informado, renderiza um SVG (IconsSwitch) no lugar da imagem.
  // Vazio => mantém o comportamento antigo com <img src>, garantindo
  // retrocompatibilidade com as telas que passam apenas imgSrc.
  icon = input<string>('');
  title = input<string>('title');
  subtitle = input<string>('subtitle');
  description = input<string>('description');
  action = output<void>();

  onClick(){
    this.action.emit();
  }
}
