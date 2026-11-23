import { Injectable, signal } from '@angular/core';

/** Quanto tempo o aviso fica na tela. */
export const TOAST_DURATION_MS = 4500;

/**
 * Aviso curto de confirmação de uma ação ("Convite enviado para…"). Um por vez:
 * um novo substitui o anterior. Erros continuam no modal global
 * (`ErrorService`); isto é só para o que deu certo.
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly messageSignal = signal<string | null>(null);
  readonly message = this.messageSignal.asReadonly();
  private timer: ReturnType<typeof setTimeout> | null = null;

  show(message: string): void {
    if (this.timer) clearTimeout(this.timer);
    this.messageSignal.set(message);
    this.timer = setTimeout(() => this.clear(), TOAST_DURATION_MS);
  }

  clear(): void {
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
    this.messageSignal.set(null);
  }
}
