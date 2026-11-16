import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Skeleton } from '../skeleton/skeleton';

/**
 * Lista no formato dos itens reais, para os dados chegarem sem salto:
 * - `card`: `detailed-item` / `analyst-item` (título, selo e botão de 44px)
 * - `row`: `user-supply-item` (índice, nome e ação à direita, com divisória)
 */
@Component({
  selector: 'app-skeleton-list',
  imports: [Skeleton],
  template: `
    <div role="status" aria-busy="true" class="w-full">
      <span class="sr-only">Carregando…</span>
      @if (variant() === 'card') {
        <div class="grid gap-3" [class]="gridClass()">
          @for (i of items(); track i) {
            <div class="shadow-lg p-3 rounded-xl flex flex-col gap-2">
              <div class="flex items-center justify-between gap-2 h-7">
                <app-skeleton width="60%" height="1.1rem" radius="0.375rem" />
                <app-skeleton width="3rem" height="1.1rem" radius="9999px" />
              </div>
              <app-skeleton height="var(--control-min-height)" />
            </div>
          }
        </div>
      } @else {
        <div class="flex flex-col gap-3">
          @for (i of items(); track i) {
            <div class="flex justify-between items-center gap-4 border-b border-black/20 pb-3">
              <div class="flex gap-4 items-center flex-1 min-w-0">
                <app-skeleton width="1rem" height="1rem" radius="0.25rem" />
                <app-skeleton width="min(14rem, 50%)" height="1rem" radius="0.375rem" />
              </div>
              <app-skeleton width="9rem" height="var(--control-min-height)" />
            </div>
          }
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonList {
  count = input(6);
  variant = input<'card' | 'row'>('card');
  /** Colunas da grade no modo `card` — as mesmas da lista real. */
  gridClass = input('sm:grid-cols-2 md:grid-cols-3');
  items = computed(() => Array.from({ length: this.count() }, (_, i) => i));
}
