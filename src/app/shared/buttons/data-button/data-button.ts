import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IconsSwitch } from '../../icons/icons-switch/icons-switch';
import { ChevronRight } from '../../icons/chevron-right/chevron-right';

@Component({
  selector: 'app-data-button',
  imports: [IconsSwitch, ChevronRight],
  templateUrl: './data-button.html',
  styleUrl: './data-button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataButton {
  title = input('Título');
  data = input<string | string[] | null>(null);
  dataArray = input<string[]>([]);
  icon = input('heart');
  disabled = input(false);
  click = output<void>();

  onClick() {
    this.click.emit();
  }
}
