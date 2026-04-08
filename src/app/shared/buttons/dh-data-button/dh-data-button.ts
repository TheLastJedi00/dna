import { Component, input, output } from '@angular/core';
import { IconsSwitch } from '../../icons/icons-switch/icons-switch';
import { ChevronRight } from "../../icons/chevron-right/chevron-right";

@Component({
  selector: 'app-dh-data-button',
  imports: [IconsSwitch, ChevronRight],
  templateUrl: './dh-data-button.html',
  styleUrl: './dh-data-button.scss',
})
export class DhDataButton {
  title = input('Título');
  data = input<string | null>(null);
  dataArray = input<string[]>([]);
  icon = input('heart');
  disabled = input(false)
  click = output<void>();

  onClick(){
    this.click.emit()
  }
}
