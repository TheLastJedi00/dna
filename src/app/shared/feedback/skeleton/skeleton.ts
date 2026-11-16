import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Bloco primitivo de skeleton. Só desenha a forma: quem o usa reproduz o
 * formato do conteúdo final (mesma altura de linha/card), para os dados
 * chegarem sem salto de layout.
 *
 * É decorativo (`aria-hidden`): o anúncio "Carregando…" para leitor de tela
 * fica no container, junto do `aria-busy`.
 */
@Component({
  selector: 'app-skeleton',
  template: '',
  styleUrl: './skeleton.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'aria-hidden': 'true',
    '[style.width]': 'width()',
    '[style.height]': 'height()',
    '[style.border-radius]': 'radius()',
  },
})
export class Skeleton {
  width = input('100%');
  height = input('1rem');
  radius = input('var(--control-radius)');
}
