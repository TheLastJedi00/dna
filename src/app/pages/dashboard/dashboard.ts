import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { UserPanelHeader } from '../../shared/headers/user-panel-header/user-panel-header';
import { UserPanelFooter } from '../../shared/footers/user-panel-footer/user-panel-footer';
import { PanelCard } from '../../shared/cards/panel-card/panel-card';
import { WelcomeBand } from '../../shared/headers/welcome-band/welcome-band';
import { CurrentUserService } from '../../core/services/current-user.service';
import { LoginService } from '../../core/services/login.service';
import { VerifyEmailModal } from '../../shared/modal/verify-email-modal/verify-email-modal';

/** Nome do papel no selo da faixa (gestão). Admin prevalece sobre Manager. */
function roleLabel(roles: string[]): string | null {
  if (roles.includes('ADMIN')) return 'Admin';
  if (roles.includes('MANAGER')) return 'Manager';
  if (roles.includes('ANALYST')) return 'Analista';
  return null;
}

/**
 * Tela inicial (spec 010): o mesmo esqueleto para todas as roles — faixa de
 * boas-vindas com o nome e o painel em linhas. Sem e-mail confirmado, o popup
 * de verificação cobre a tela.
 */
@Component({
  selector: 'app-dashboard',
  imports: [UserPanelHeader, UserPanelFooter, PanelCard, WelcomeBand, VerifyEmailModal],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard implements OnInit {
  /** Mesmo perfil do menu lateral — uma única chamada a `/users/me` por sessão. */
  readonly currentUser = inject(CurrentUserService);
  readonly login = inject(LoginService);

  readonly loadFailed = computed(() => this.currentUser.state.status() === 'error');

  /** Se o perfil não carregar, o e-mail da sessão ocupa o lugar do nome. */
  readonly displayName = computed(() =>
    this.loadFailed() ? this.login.email : this.currentUser.displayName(),
  );
  readonly nameIsEmail = computed(() => this.loadFailed() || this.currentUser.isEmailFallback());

  readonly roleBadge = computed(() => roleLabel(this.login.roles()));

  readonly subtitle = computed(() => {
    const roles = this.login.roles();
    if (roles.includes('USER')) {
      return 'Sua Matriz DNA está organizada em três pilares. Comece por qualquer um.';
    }
    if (roles.includes('ADMIN') || roles.includes('MANAGER')) {
      return 'Acompanhe os usuários, as análises do DNA e a equipe de Analistas.';
    }
    return 'Acompanhe os usuários que você cadastrou e as análises do DNA de cada um.';
  });

  ngOnInit() {
    this.currentUser.ensureLoaded();
  }
}
