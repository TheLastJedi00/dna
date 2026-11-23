import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserPanelHeader } from '../../shared/headers/user-panel-header/user-panel-header';
import { UserPanelFooter } from '../../shared/footers/user-panel-footer/user-panel-footer';
import { WelcomeBand } from '../../shared/headers/welcome-band/welcome-band';
import { CurrentUserService } from '../../core/services/current-user.service';
import { LoginService } from '../../core/services/login.service';

/**
 * Meu Perfil (spec 010): dados da conta, alterar senha, alterar e-mail e
 * excluir a conta (LGPD). Aberto também para quem ainda não confirmou o
 * e-mail — é aqui que se corrige um e-mail errado.
 */
@Component({
  selector: 'app-profile',
  imports: [UserPanelHeader, UserPanelFooter, WelcomeBand, RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Profile implements OnInit {
  readonly currentUser = inject(CurrentUserService);
  readonly login = inject(LoginService);

  /** Se o perfil não carregar, o e-mail da sessão ocupa o lugar do nome. */
  readonly displayName = computed(() =>
    this.currentUser.state.status() === 'error'
      ? this.login.email
      : this.currentUser.displayName(),
  );
  readonly nameIsEmail = computed(
    () => this.currentUser.state.status() === 'error' || this.currentUser.isEmailFallback(),
  );

  ngOnInit(): void {
    this.currentUser.ensureLoaded();
  }
}
