import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../../core/services/login.service';
import { authErrorMessage } from '../../../core/utils/firebase-auth-error';

/** O Firebase limita o reenvio; o botão espera este tempo entre envios. */
export const RESEND_COOLDOWN_SECONDS = 60;

/**
 * Popup que **não fecha** enquanto o e-mail não for confirmado (spec 010):
 * sem X, sem clique fora, sem Esc. As saídas são confirmar, corrigir o e-mail
 * no Meu Perfil ou sair.
 */
@Component({
  selector: 'app-verify-email-modal',
  templateUrl: './verify-email-modal.html',
  styleUrl: './verify-email-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyEmailModal {
  private readonly login = inject(LoginService);
  private readonly router = inject(Router);

  readonly email = this.login.email;
  readonly sent = signal(false);
  readonly cooldown = signal(0);
  readonly sending = signal(false);
  readonly checking = signal(false);
  readonly notYet = signal(false);
  readonly error = signal<string | null>(null);

  private readonly primary = viewChild<ElementRef<HTMLButtonElement>>('primary');
  private timer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    inject(DestroyRef).onDestroy(() => this.stopTimer());
    afterNextRender(() => this.primary()?.nativeElement.focus());
  }

  async send() {
    if (this.cooldown() > 0 || this.sending()) return;
    this.sending.set(true);
    this.error.set(null);
    this.notYet.set(false);
    try {
      await this.login.sendEmailVerification();
      this.sent.set(true);
      this.startCooldown();
    } catch (e) {
      this.error.set(authErrorMessage(e, 'Não foi possível enviar o e-mail. Tente novamente.'));
    } finally {
      this.sending.set(false);
    }
  }

  /** "Já confirmei": recarrega o usuário e renova o token. */
  async check() {
    this.checking.set(true);
    this.error.set(null);
    try {
      const verified = await this.login.refreshEmailVerification();
      this.notYet.set(!verified);
    } catch (e) {
      this.error.set(authErrorMessage(e, 'Não foi possível verificar agora. Tente novamente.'));
    } finally {
      this.checking.set(false);
    }
  }

  fixEmail() {
    this.router.navigate(['/profile']);
  }

  async logout() {
    await this.login.logout();
    await this.router.navigate(['/login']);
  }

  /** Esc não fecha: não há para onde voltar sem confirmar o e-mail. */
  blockEscape(event: Event) {
    event.preventDefault();
  }

  private startCooldown() {
    this.stopTimer();
    this.cooldown.set(RESEND_COOLDOWN_SECONDS);
    this.timer = setInterval(() => {
      const next = this.cooldown() - 1;
      this.cooldown.set(Math.max(next, 0));
      if (next <= 0) this.stopTimer();
    }, 1000);
  }

  private stopTimer() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }
}
