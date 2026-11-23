import { inject, Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';
import type { User } from 'firebase/auth';
import { FirebaseAuthClient } from '../firebase/firebase-auth.client';
import { UserRole } from '../../types/types';

const KNOWN_ROLES: readonly UserRole[] = ['MANAGER', 'ADMIN', 'ANALYST', 'USER'];

function toRoles(claim: unknown): UserRole[] {
  if (!Array.isArray(claim)) return [];
  return claim.filter((role): role is UserRole => KNOWN_ROLES.includes(role as UserRole));
}

/**
 * Dono único da sessão, agora sobre o **Firebase Auth** (spec 010). Mantém a
 * API pública que o app já usava (`userId`, `getUserRole()`, `logout()`,
 * `sessionCleared$`…) para limitar a mudança nos componentes.
 *
 * O Firebase guarda e renova os tokens sozinho; aqui ficam só os signals do
 * usuário atual, das roles (custom claim `roles`) e do e-mail confirmado.
 */
@Injectable({ providedIn: 'root' })
export class LoginService {
  private readonly firebase = inject(FirebaseAuthClient);

  private readonly userSignal = signal<User | null>(null);
  private readonly rolesSignal = signal<UserRole[]>([]);
  private readonly emailVerifiedSignal = signal(false);

  readonly user = this.userSignal.asReadonly();
  readonly roles = this.rolesSignal.asReadonly();
  readonly emailVerified = this.emailVerifiedSignal.asReadonly();

  private readonly sessionClearedSubject = new Subject<void>();
  /**
   * Emite quando a sessão é encerrada (logout, token recusado). Quem guarda
   * dados do usuário em memória (ex.: `CurrentUserService`) escuta para não
   * vazar o perfil para o próximo login no mesmo navegador.
   */
  readonly sessionCleared$ = this.sessionClearedSubject.asObservable();

  /** Última aplicação de usuário em andamento (as claims chegam assíncronas). */
  private applying: Promise<void> = Promise.resolve();
  private readonly restored: Promise<void>;

  constructor() {
    this.firebase.onIdTokenChanged((user) => {
      this.applying = this.applyUser(user);
    });
    this.restored = this.firebase.ready();
  }

  /**
   * Resolve quando a sessão salva foi restaurada **e** as claims carregadas.
   * Guards esperam por isto: no F5 o Firebase restaura a sessão de forma
   * assíncrona, e decidir antes mandaria quem está logado para o login.
   */
  async whenReady(): Promise<void> {
    await this.restored;
    await this.applying;
  }

  async login(email: string, password: string): Promise<void> {
    const user = await this.firebase.signIn(email, password);
    await this.applyUser(user);
  }

  /** Encerra a sessão no Firebase e limpa o estado local. */
  async logout(): Promise<void> {
    await this.firebase.signOut();
    this.clearLocal();
  }

  /** Versão síncrona do logout, para quando a API recusa o token. */
  clearSession(): void {
    void this.firebase.signOut();
    this.clearLocal();
  }

  isSessionValid(): boolean {
    return this.userSignal() !== null;
  }

  getUserRole(): UserRole[] | null {
    return this.userSignal() ? this.rolesSignal() : null;
  }

  isEmailVerified(): boolean {
    return this.emailVerifiedSignal();
  }

  get userId(): string {
    return this.userSignal()?.uid ?? '';
  }

  get email(): string {
    return this.userSignal()?.email ?? '';
  }

  /** ID token para o header Authorization. `forceRefresh` pede um novo ao Firebase. */
  async getIdToken(forceRefresh = false): Promise<string | null> {
    const user = this.firebase.currentUser;
    return user ? this.firebase.getIdToken(user, forceRefresh) : null;
  }

  /** "Esqueci minha senha" e convite: o Firebase não revela se o e-mail existe. */
  sendPasswordReset(email: string): Promise<void> {
    return this.firebase.sendPasswordReset(email);
  }

  async sendEmailVerification(): Promise<void> {
    await this.firebase.sendEmailVerification(this.requireUser());
  }

  /**
   * "Já confirmei": recarrega o usuário e **renova o token** — o claim
   * `email_verified` que a API lê só muda num token novo.
   */
  async refreshEmailVerification(): Promise<boolean> {
    const user = this.requireUser();
    await this.firebase.reload(user);
    await this.firebase.getIdToken(user, true);
    await this.applyUser(user);
    return this.emailVerifiedSignal();
  }

  /**
   * A API recusou com `EMAIL_NOT_VERIFIED` (403): o e-mail deixou de valer como
   * confirmado (ex.: trocado). Reabre o popup de verificação no dashboard.
   */
  markEmailUnverified(): void {
    this.emailVerifiedSignal.set(false);
  }

  /** Pede a senha de novo (necessário para trocar senha/e-mail e excluir a conta). */
  reauthenticate(password: string): Promise<void> {
    return this.firebase.reauthenticate(this.requireUser(), password);
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const user = this.requireUser();
    await this.firebase.reauthenticate(user, currentPassword);
    await this.firebase.updatePassword(user, newPassword);
  }

  /** Envia o link para o novo e-mail; a troca só acontece quando ele for aberto. */
  async changeEmail(currentPassword: string, newEmail: string): Promise<void> {
    const user = this.requireUser();
    await this.firebase.reauthenticate(user, currentPassword);
    await this.firebase.verifyBeforeUpdateEmail(user, newEmail);
  }

  private async applyUser(user: User | null): Promise<void> {
    if (!user) {
      this.userSignal.set(null);
      this.rolesSignal.set([]);
      this.emailVerifiedSignal.set(false);
      return;
    }
    const token = await this.firebase.getIdTokenResult(user);
    this.rolesSignal.set(toRoles(token.claims['roles']));
    this.emailVerifiedSignal.set(user.emailVerified);
    this.userSignal.set(user);
  }

  private clearLocal(): void {
    this.userSignal.set(null);
    this.rolesSignal.set([]);
    this.emailVerifiedSignal.set(false);
    this.sessionClearedSubject.next();
  }

  private requireUser(): User {
    const user = this.firebase.currentUser ?? this.userSignal();
    if (!user) throw new Error('Nenhuma sessão ativa.');
    return user;
  }
}
