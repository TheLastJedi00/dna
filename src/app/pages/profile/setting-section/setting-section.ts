import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  effect,
  inject,
  input,
  model,
} from '@angular/core';

/**
 * Linha de configuração do Meu Perfil (spec 010): título, descrição e um botão
 * que **abre o formulário no lugar**, sem trocar de tela. O formulário vem por
 * projeção e fecha mudando `open` para `false`.
 */
@Component({
  selector: 'app-setting-section',
  template: `
    <div class="head">
      <div>
        <h3 [id]="headingId">{{ heading() }}</h3>
        <p>{{ description() }}</p>
      </div>
      @if (!open()) {
        <button
          type="button"
          class="toggle"
          [class.toggle-danger]="tone() === 'danger'"
          [attr.aria-expanded]="open()"
          [attr.aria-controls]="bodyId"
          (click)="open.set(true)"
        >
          {{ actionLabel() }}
        </button>
      }
    </div>
    <div class="body" [class.is-open]="open()" [id]="bodyId" [attr.aria-labelledby]="headingId">
      <div class="body-inner">
        @if (open()) {
          <ng-content />
        }
      </div>
    </div>
  `,
  styleUrl: './setting-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingSection {
  private static nextId = 0;
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  heading = input.required<string>();
  description = input<string>('');
  actionLabel = input.required<string>();
  tone = input<'default' | 'danger'>('default');
  open = model<boolean>(false);

  private readonly uid = SettingSection.nextId++;
  readonly headingId = `setting-${this.uid}-title`;
  readonly bodyId = `setting-${this.uid}-body`;

  constructor() {
    // Ao abrir, o foco vai para o primeiro campo (quem usa teclado não se perde).
    effect(() => {
      if (!this.open()) return;
      queueMicrotask(() =>
        this.host.nativeElement.querySelector<HTMLElement>('input, button[type="submit"]')?.focus(),
      );
    });
  }
}
