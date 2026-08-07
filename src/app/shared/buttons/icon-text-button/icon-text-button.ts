import { Component, computed, input, output } from '@angular/core';
import { IconsSwitch } from '../../icons/icons-switch/icons-switch';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-icon-text-button',
  imports: [IconsSwitch, NgClass, RouterLink],
  templateUrl: './icon-text-button.html',
  styleUrl: './icon-text-button.scss',
})
export class IconTextButton {
  disabled = input(false);
  icon = input('heart');
  text = input('Text');
  click = output<void>();
  class = input<string>('');
  type = input('button');
  routerLink = input<string | null>(null);
  /** `center` para CTAs de largura total; `start` (padrão) para ações em linha. */
  align = input<'start' | 'center'>('start');
  /** Nome acessível quando não há texto visível. */
  ariaLabel = input<string>('');

  /** Sem texto o botão vira alvo quadrado de 44px, não um retângulo apertado. */
  isIconOnly = computed(() => this.text().trim() === '');

  onClick(event: Event) {
    event.stopPropagation();
    this.click.emit();
  }
}
