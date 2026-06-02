import { Component, input, output } from '@angular/core';
import { IconsSwitch } from '../../icons/icons-switch/icons-switch';
import { ChevronRight } from "../../icons/chevron-right/chevron-right";

@Component({
  selector: 'app-astro-data-button',
  imports: [IconsSwitch, ChevronRight],
  templateUrl: './astro-data-button.html',
  styleUrl: './astro-data-button.scss',
})
export class AstroDataButton {
  title = input('Título');
  data = input<string | string[] | null>(null);
  dataArray = input<string[]>([]);
  icon = input('sol-astro');
  disabled = input(false);
  click = output<void>();

  onClick(){
    this.click.emit()
  }
}
