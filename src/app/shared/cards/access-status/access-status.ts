import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { AccessStatus } from '../../../core/models/userdata.model';

interface StatusView {
  label: string;
  text: string;
  tone: 'ok' | 'warn' | 'off';
  canResend: boolean;
}

const VIEWS: Record<AccessStatus | 'none', StatusView> = {
  invite_pending: {
    label: 'Convite pendente',
    text: 'Ainda não criou a senha. O convite vale para o e-mail cadastrado.',
    tone: 'warn',
    canResend: true,
  },
  email_unverified: {
    label: 'E-mail não confirmado',
    text: 'Já entrou, mas ainda não confirmou o e-mail. Até confirmar, vê o aviso de verificação.',
    tone: 'warn',
    canResend: true,
  },
  active: {
    label: 'Acesso ativo',
    text: 'E-mail confirmado.',
    tone: 'ok',
    canResend: false,
  },
  none: {
    label: 'Sem acesso',
    text: 'Não há conta de acesso para este cadastro.',
    tone: 'off',
    canResend: false,
  },
};

/**
 * Bloco "Acesso" do detalhe de usuário/Analista (spec 010): o status vindo do
 * Firebase e o "Reenviar convite". Substitui a senha provisória da spec 005.
 * Só exibe e emite; quem reenvia é a página.
 */
@Component({
  selector: 'app-access-status',
  template: `
    <section class="access" aria-labelledby="access-title">
      <div class="head">
        <h2 id="access-title">Acesso</h2>
        <span class="badge" [class]="'badge badge-' + view().tone">{{ view().label }}</span>
      </div>
      <p>{{ view().text }}</p>
      @if (view().canResend) {
        <button type="button" class="resend" [disabled]="resending()" (click)="resend.emit()">
          {{ resending() ? 'Enviando…' : 'Reenviar convite' }}
        </button>
      }
    </section>
  `,
  styles: `
    .access {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
      margin-top: 0.75rem;
      padding: 1rem 1.1rem;
      border-radius: 0.9rem;
      background: var(--color-surface-disabled);
    }
    .head {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
    }
    h2 {
      margin: 0;
      font-family: 'Merriweather', serif;
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--color-primary);
    }
    p {
      margin: 0;
      font-size: 0.88rem;
      line-height: 1.5;
      color: var(--color-text-muted);
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.25rem 0.6rem;
      border-radius: 999px;
      font-size: 0.78rem;
      font-weight: 600;
    }
    .badge::before {
      content: '';
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: currentColor;
    }
    .badge-ok {
      background: var(--color-surface-linen);
      color: var(--color-primary);
    }
    .badge-warn {
      background: rgba(130, 106, 60, 0.16);
      color: #6b5428;
    }
    .badge-off {
      background: rgba(179, 38, 30, 0.1);
      color: var(--color-danger);
    }
    .resend {
      align-self: flex-start;
      min-height: var(--control-min-height);
      padding: var(--control-padding-y) var(--control-padding-x);
      border: 1px solid var(--color-border);
      border-radius: var(--control-radius);
      background: #fff;
      color: var(--color-primary);
      font-weight: 600;
      cursor: pointer;
    }
    .resend:hover:not(:disabled) {
      background: var(--color-surface-linen);
    }
    .resend:disabled {
      cursor: not-allowed;
      opacity: 0.7;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccessStatusCard {
  status = input<AccessStatus | null | undefined>(null);
  resending = input<boolean>(false);
  resend = output<void>();

  readonly view = computed(() => VIEWS[this.status() ?? 'none']);
}
