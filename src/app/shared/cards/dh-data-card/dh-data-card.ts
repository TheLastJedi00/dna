import { Component, input } from '@angular/core';
import { IconsSwitch } from "../../icons/icons-switch/icons-switch";

@Component({
  selector: 'app-dh-data-card',
  imports: [IconsSwitch],
  templateUrl: './dh-data-card.html',
  styleUrl: './dh-data-card.scss',
})
export class DhDataCard {
  title = input<string>("Título")
  data = input<string|null>(null)
  dataArray = input<string[]|null>(null)
  icon = input<string>("heart")
}
