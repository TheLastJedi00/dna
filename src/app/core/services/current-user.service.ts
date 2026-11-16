import { HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { catchError, of, throwError } from 'rxjs';
import { UserData } from '../models/userdata.model';
import { loadState } from '../utils/load-state';
import { LoginService } from './login.service';
import { UserService } from './user.service';

/**
 * Perfil de quem está logado, buscado **uma vez por sessão** e compartilhado
 * pelo menu lateral e pelo dashboard (que estão na mesma tela — sem o cache
 * seriam duas chamadas iguais a `/users/me`).
 *
 * Manager não tem documento em `users` e o endpoint responde 404: nesse caso o
 * estado fica `empty` e o nome de exibição cai para o e-mail do token.
 */
@Injectable({ providedIn: 'root' })
export class CurrentUserService {
  private readonly loginService = inject(LoginService);
  private readonly userService = inject(UserService);

  /** Id para o qual o estado atual foi carregado. */
  private loadedFor: string | null = null;
  private pending: Promise<void> | null = null;

  readonly state = loadState<UserData | null>(
    () =>
      this.userService.findMe(this.loginService.userId).pipe(
        catchError((e) =>
          e instanceof HttpErrorResponse && e.status === 404 ? of(null) : throwError(() => e),
        ),
      ),
    { initial: 'idle' },
  );

  readonly user = computed(() => this.state.data());

  /**
   * Nome a exibir: `fullName` do perfil ou, sem perfil, o e-mail do token.
   * `null` enquanto carrega ou em erro — a tela mostra skeleton/erro.
   */
  readonly displayName = computed<string | null>(() => {
    const status = this.state.status();
    if (status === 'success') {
      return this.state.data()?.fullName?.trim() || this.tokenEmail();
    }
    if (status === 'empty') return this.tokenEmail();
    return null;
  });

  /** true quando o nome exibido é o e-mail (fallback), não um nome de pessoa. */
  readonly isEmailFallback = computed(() => {
    const name = this.displayName();
    return !!name && name === this.tokenEmail() && !this.state.data()?.fullName?.trim();
  });

  constructor() {
    this.loginService.sessionCleared$.subscribe(() => this.clear());
  }

  /**
   * Garante o perfil da sessão atual. Não repete a chamada se já carregou (ou
   * está carregando) para o mesmo usuário; recarrega se o usuário mudou ou se
   * a tentativa anterior falhou.
   */
  ensureLoaded(): Promise<void> {
    const id = this.loginService.userId;
    if (!id) return Promise.resolve();
    const status = this.state.status();
    if (id === this.loadedFor && status !== 'error' && status !== 'idle') {
      return this.pending ?? Promise.resolve();
    }
    return this.reload();
  }

  /** Busca de novo (botão "Tentar novamente"). */
  reload(): Promise<void> {
    this.loadedFor = this.loginService.userId || null;
    const p = this.state.load().finally(() => {
      if (this.pending === p) this.pending = null;
    });
    this.pending = p;
    return p;
  }

  /** Esquece o perfil (logout / sessão encerrada). */
  clear(): void {
    this.loadedFor = null;
    this.pending = null;
    this.state.reset();
  }

  private tokenEmail(): string | null {
    return this.loginService.getDecodedToken()?.email ?? null;
  }
}
