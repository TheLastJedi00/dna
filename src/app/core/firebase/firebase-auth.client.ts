import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  Auth,
  browserLocalPersistence,
  EmailAuthProvider,
  getAuth,
  IdTokenResult,
  onIdTokenChanged,
  reauthenticateWithCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  User,
  verifyBeforeUpdateEmail,
} from 'firebase/auth';
import { environment } from '../../../environments/environment';

/**
 * Único ponto do front que fala com o **SDK do Firebase Auth** (spec 010).
 * O resto do app depende desta classe — os testes a trocam por um mock.
 *
 * Só existe no navegador: no SSR o Firebase não é inicializado e tudo se
 * comporta como "sem sessão" (as rotas autenticadas não têm dados no servidor).
 */
@Injectable({ providedIn: 'root' })
export class FirebaseAuthClient {
  private readonly auth: Auth | null;

  constructor() {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) {
      this.auth = null;
      return;
    }
    const app = getApps().length ? getApp() : initializeApp(environment.firebase);
    this.auth = getAuth(app);
    // E-mails e mensagens do Firebase (verificação, redefinição) em português.
    this.auth.languageCode = 'pt';
    void setPersistence(this.auth, browserLocalPersistence);
  }

  get currentUser(): User | null {
    return this.auth?.currentUser ?? null;
  }

  /** Resolve quando o Firebase terminou de restaurar a sessão salva (F5). */
  async ready(): Promise<void> {
    await this.auth?.authStateReady();
  }

  onIdTokenChanged(callback: (user: User | null) => void): () => void {
    if (!this.auth) return () => undefined;
    return onIdTokenChanged(this.auth, callback);
  }

  async signIn(email: string, password: string): Promise<User> {
    const credential = await signInWithEmailAndPassword(this.requireAuth(), email, password);
    return credential.user;
  }

  async signOut(): Promise<void> {
    if (this.auth) await signOut(this.auth);
  }

  getIdToken(user: User, forceRefresh = false): Promise<string> {
    return user.getIdToken(forceRefresh);
  }

  getIdTokenResult(user: User, forceRefresh = false): Promise<IdTokenResult> {
    return user.getIdTokenResult(forceRefresh);
  }

  reload(user: User): Promise<void> {
    return user.reload();
  }

  /** E-mail "Defina sua senha"/"Redefinir senha", voltando para o login do app. */
  sendPasswordReset(email: string): Promise<void> {
    return sendPasswordResetEmail(this.requireAuth(), email, this.continueTo('/login'));
  }

  sendEmailVerification(user: User): Promise<void> {
    return sendEmailVerification(user, this.continueTo('/dashboard'));
  }

  /** Pede a senha de novo: renova o `auth_time` (exigido para excluir a conta). */
  async reauthenticate(user: User, password: string): Promise<void> {
    if (!user.email) throw new Error('Conta sem e-mail.');
    await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, password));
  }

  updatePassword(user: User, newPassword: string): Promise<void> {
    return updatePassword(user, newPassword);
  }

  /** O e-mail só muda quando a pessoa abre o link enviado ao novo endereço. */
  verifyBeforeUpdateEmail(user: User, newEmail: string): Promise<void> {
    return verifyBeforeUpdateEmail(user, newEmail, this.continueTo('/login'));
  }

  private continueTo(path: string) {
    return { url: `${window.location.origin}${path}` };
  }

  private requireAuth(): Auth {
    if (!this.auth) throw new Error('Firebase Auth indisponível fora do navegador.');
    return this.auth;
  }
}
