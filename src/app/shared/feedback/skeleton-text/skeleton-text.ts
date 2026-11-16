import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Skeleton } from '../skeleton/skeleton';

/** Parágrafo de N linhas; a última é mais curta, como num texto real. */
@Component({
  selector: 'app-skeleton-text',
  imports: [Skeleton],
  template: `
    <div class="flex flex-col" [style.gap]="gap()" role="status" aria-busy="true">
      <span class="sr-only">Carregando…</span>
      @for (w of widths(); track $index) {
        <app-skeleton [width]="w" [height]="lineHeight()" radius="0.375rem" />
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonText {
  lines = input(3);
  lineHeight = input('1rem');
  gap = input('0.625rem');

  widths = computed(() =>
    Array.from({ length: this.lines() }, (_, i) =>
      i === this.lines() - 1 && this.lines() > 1 ? '60%' : '100%',
    ),
  );
}
