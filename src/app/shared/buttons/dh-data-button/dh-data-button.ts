import { Component, input } from '@angular/core';
import { IconsSwitch } from '../../icons/icons-switch/icons-switch';

@Component({
  selector: 'app-dh-data-button',
  imports: [IconsSwitch],
  templateUrl: './dh-data-button.html',
  styleUrl: './dh-data-button.scss',
})
export class DhDataButton {
  title = input('Título');
  data = input('Dados');
  icon = input('heart');
}
