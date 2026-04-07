import { Component, input } from '@angular/core';
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
  data = input('Dados');
  icon = input('heart');
  disabled = input(false)
}
