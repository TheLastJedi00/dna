import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Skeleton } from '../skeleton/skeleton';

/** Grade de cards (botões de tópico/módulo dos pilares). */
@Component({
  selector: 'app-skeleton-card',
  imports: [Skeleton],
  template: `
    <div class="grid gap-3 w-full" [class]="gridClass()" role="status" aria-busy="true">
      <span class="sr-only">Carregando…</span>
      @for (i of items(); track i) {
        <app-skeleton [height]="height()" radius="0.75rem" />
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonCard {
  count = input(4);
  height = input('6rem');
  /** Classes de coluna da grade, iguais às da tela real. */
  gridClass = input('grid-cols-1 sm:grid-cols-2');
  items = computed(() => Array.from({ length: this.count() }, (_, i) => i));
}
