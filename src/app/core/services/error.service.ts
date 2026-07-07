import { Injectable, signal } from '@angular/core';

/**
 * Estado global do modal de erro. O errorInterceptor alimenta as mensagens;
 * o ErrorModal (montado uma vez na raiz) as exibe.
 */
@Injectable({ providedIn: 'root' })
export class ErrorService {
  readonly message = signal<string | null>(null);

  show(message: string): void {
    this.message.set(message);
  }

  clear(): void {
    this.message.set(null);
  }
}
