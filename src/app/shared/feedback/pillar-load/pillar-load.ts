import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LoadStatus } from '../../../core/utils/load-state';
import { Skeleton } from '../skeleton/skeleton';
import { SkeletonCard } from '../skeleton-card/skeleton-card';
import { LoadError } from '../load-error/load-error';

/**
 * Estados de carregamento das telas de pilar (homes e detalhes): skeleton,
 * erro com "Tentar novamente" e vazio. Em `success` não desenha nada — a tela
 * mostra o próprio conteúdo dentro de um `@if (status === 'success')`.
 *
 * (O conteúdo não é projetado aqui de propósito: `ng-content` instancia os
 * filhos mesmo escondidos, e os templates dos pilares leem `data()!`.)
 */
@Component({
  selector: 'app-pillar-load',
  imports: [Skeleton, SkeletonCard, LoadError],
  template: `
    @switch (status()) {
      @case ('loading') {
        <div class="flex flex-col items-center gap-4" role="status" aria-busy="true">
          <span class="sr-only">Carregando {{ pillar() }}…</span>
          @if (variant() === 'home') {
            <app-skeleton width="min(18rem, 80%)" height="1.75rem" radius="0.375rem" />
          }
          <app-skeleton-card [count]="cards()" [height]="cardHeight()" [gridClass]="gridClass()" />
        </div>
      }
      @case ('error') {
        <app-load-error
          [title]="'Não foi possível carregar ' + pillar()"
          [message]="error() ?? ''"
          (retry)="retry.emit()"
        />
      }
      @case ('empty') {
        <p class="py-10 text-center text-muted font-merriweather">{{ emptyMessage() }}</p>
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PillarLoad {
  status = input.required<LoadStatus>();
  error = input<string | null>(null);
  /** Nome do pilar no texto ("a Astrologia", "o Desenho Humano"…). */
  pillar = input.required<string>();
  emptyMessage = input('Esta análise ainda não está disponível.');
  /** `home`: título + grade; `detail`: só a lista de tópicos. */
  variant = input<'home' | 'detail'>('home');
  cards = input(6);
  cardHeight = input('6rem');
  gridClass = input('grid-cols-2 sm:grid-cols-3');
  retry = output<void>();
}
