import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Skeleton } from '../skeleton/skeleton';

/**
 * Lista de itens no formato dos cards de listagem (`detailed-item`,
 * `analyst-item`, `user-supply-item`): ícone, título e linha de apoio.
 */
@Component({
  selector: 'app-skeleton-list',
  imports: [Skeleton],
  template: `
    <ul class="flex flex-col gap-3 w-full" role="status" aria-busy="true">
      <span class="sr-only">Carregando…</span>
      @for (i of items(); track i) {
        <li class="flex items-center gap-3 p-3 rounded-xl bg-white/70 shadow-sm">
          <app-skeleton width="2.75rem" height="2.75rem" radius="9999px" />
          <div class="flex flex-col gap-2 flex-1 min-w-0">
            <app-skeleton width="55%" height="1.1rem" radius="0.375rem" />
            <app-skeleton width="35%" height="0.8rem" radius="0.375rem" />
          </div>
        </li>
      }
    </ul>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonList {
  count = input(5);
  items = computed(() => Array.from({ length: this.count() }, (_, i) => i));
}
