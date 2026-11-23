import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';

/** Aviso de confirmação no rodapé da tela (leitor de tela: `role="status"`). */
@Component({
  selector: 'app-toast',
  template: `
    <div class="toast-region" role="status" aria-live="polite">
      @if (message(); as text) {
        <p class="toast">{{ text }}</p>
      }
    </div>
  `,
  styles: `
    .toast-region {
      position: fixed;
      left: 50%;
      bottom: 1.25rem;
      z-index: 70;
      transform: translateX(-50%);
      width: max-content;
      max-width: calc(100vw - 2rem);
      pointer-events: none;
    }
    .toast {
      margin: 0;
      padding: 0.8rem 1rem;
      border-radius: 0.75rem;
      background: var(--color-primary);
      color: #fff;
      font-size: 0.9rem;
      line-height: 1.4;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
      animation: toast-in 200ms ease-out;
    }
    @keyframes toast-in {
      from {
        opacity: 0;
        transform: translateY(0.5rem);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .toast {
        animation: none;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Toast {
  readonly message = inject(ToastService).message;
}
