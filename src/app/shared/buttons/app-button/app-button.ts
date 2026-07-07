import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgClass } from '@angular/common';

export type ButtonVariant = 'elevated' | 'flat' | 'text';

/**
 * Botão de texto configurável que unifica elevated/flat/text-button.
 * `variant` escolhe o estilo base; `classes` recebe utilitários extras (cores).
 */
@Component({
  selector: 'app-button',
  imports: [NgClass],
  templateUrl: './app-button.html',
  styleUrl: './app-button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppButton {
  text = input.required<string>();
  variant = input<ButtonVariant>('flat');
  classes = input<string>('');
  disabled = input<boolean>(false);
  action = output<void>();

  onClick() {
    this.action.emit();
  }
}
