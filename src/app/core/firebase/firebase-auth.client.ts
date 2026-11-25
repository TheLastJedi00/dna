import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import type { Auth, IdTokenResult, User } from 'firebase/auth';
import { environment } from '../../../environments/environment';

type AuthSdk = typeof import('firebase/auth');

interface LoadedAuth {
  auth: Auth;
  sdk: AuthSdk;
}

/**
 * Único ponto do front que fala com o **SDK do Firebase Auth** (spec 010).
 * O resto do app depende desta classe — os testes a trocam por um mock.
 *
 * O SDK é carregado **sob demanda** (`import()`), fora do bundle inicial: sem
 * isso o bundle passava do orçamento de 500 kB. Só existe no navegador; no SSR
 * nada é carregado e tudo se comporta como "sem sessão".
 */
@Injectable({ providedIn: 'root' })
export class FirebaseAuthClient {
  private readonly loading: Promise<LoadedAuth> | null;
  private auth: Auth | null = null;

  constructor() {
    this.loading = isPlatformBrowser(inject(PLATFORM_ID)) ? this.load() : null;
  }

  private async load(): Promise<LoadedAuth> {
    const [app, sdk] = await Promise.all([import('firebase/app'), import('firebase/auth')]);
    const firebaseApp = app.getApps().length
      ? app.getApp()
      : app.initializeApp(environment.firebase);
    const auth = sdk.getAuth(firebaseApp);
    // E-mails e mensagens do Firebase (verificação, redefinição) em português.
    auth.languageCode = 'pt';
    void sdk.setPersistence(auth, sdk.browserLocalPersistence);
    this.auth = auth;
    return { auth, sdk };
  }

  private async loaded(): Promise<LoadedAuth> {
    if (!this.loading) throw new Error('Firebase Auth indisponível fora do navegador.');
    return this.loading;
  }

  /** Usuário atual; `null` também enquanto o SDK carrega (aguarde `ready()`). */
  get currentUser(): User | null {
    return this.auth?.currentUser ?? null;
  }

  /** Resolve quando o SDK carregou e a sessão salva foi restaurada (F5). */
  async ready(): Promise<void> {
    if (!this.loading) return;
    const { auth } = await this.loading;
    await auth.authStateReady();
  }

  onIdTokenChanged(callback: (user: User | null) => void): () => void {
    if (!this.loading) return () => undefined;
    let unsubscribe: (() => void) | null = null;
    let cancelled = false;
    void this.loading.then(({ auth, sdk }) => {
      if (!cancelled) unsubscribe = sdk.onIdTokenChanged(auth, callback);
    });
    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }

  async signIn(email: string, password: string): Promise<User> {
    const { auth, sdk } = await this.loaded();
    const credential = await sdk.signInWithEmailAndPassword(auth, email, password);
    return credential.user;
  }

  async signOut(): Promise<void> {
    if (!this.loading) return;
    const { auth, sdk } = await this.loading;
    await sdk.signOut(auth);
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
  async sendPasswordReset(email: string): Promise<void> {
    const { auth, sdk } = await this.loaded();
    await sdk.sendPasswordResetEmail(auth, email, this.continueTo('/login'));
  }

  async sendEmailVerification(user: User): Promise<void> {
    const { sdk } = await this.loaded();
    await sdk.sendEmailVerification(user, this.continueTo('/dashboard'));
  }

  /** Pede a senha de novo: renova o `auth_time` (exigido para excluir a conta). */
  async reauthenticate(user: User, password: string): Promise<void> {
    if (!user.email) throw new Error('Conta sem e-mail.');
    const { sdk } = await this.loaded();
    await sdk.reauthenticateWithCredential(
      user,
      sdk.EmailAuthProvider.credential(user.email, password),
    );
  }

  async updatePassword(user: User, newPassword: string): Promise<void> {
    const { sdk } = await this.loaded();
    await sdk.updatePassword(user, newPassword);
  }

  /** O e-mail só muda quando a pessoa abre o link enviado ao novo endereço. */
  async verifyBeforeUpdateEmail(user: User, newEmail: string): Promise<void> {
    const { sdk } = await this.loaded();
    await sdk.verifyBeforeUpdateEmail(user, newEmail, this.continueTo('/login'));
  }

  private continueTo(path: string) {
    return { url: `${window.location.origin}${path}` };
  }
}
