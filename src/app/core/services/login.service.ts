import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, shareReplay, tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken, UserRole } from '../../types/types';

interface TokenPair {
  access_token: string;
  refresh_token?: string;
  /** Estado da senha no login; a fonte de verdade do bloqueio é o claim do token. */
  mustChangePassword?: boolean;
}

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

/**
 * Dono único da sessão: guarda/limpa tokens, decodifica, valida expiração e
 * coordena o refresh (compartilhado entre requisições concorrentes).
 */
@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;
  private readonly apiAuth = this.baseUrl + '/auth';

  private refreshing$: Observable<TokenPair> | null = null;

  login(email: string, password: string): Observable<TokenPair> {
    return this.http
      .post<TokenPair>(this.apiAuth, { email, password })
      .pipe(tap((response) => this.storeTokens(response)));
  }

  /** Renova o par de tokens; compartilha a chamada em voo entre 401 concorrentes. */
  refreshTokens(): Observable<TokenPair> {
    if (this.refreshing$) {
      return this.refreshing$;
    }
    const refresh_token = this.getRefreshToken();
    if (!refresh_token) {
      return throwError(() => new Error('Sem refresh token.'));
    }
    this.refreshing$ = this.http
      .post<TokenPair>(this.apiAuth + '/refresh', { refresh_token })
      .pipe(
        tap((tokens) => this.storeTokens(tokens)),
        catchError((err) => {
          this.clearSession();
          return throwError(() => err);
        }),
        finalize(() => (this.refreshing$ = null)),
        shareReplay(1),
      );
    return this.refreshing$;
  }

  /** Revoga o refresh no backend (best-effort) e limpa a sessão local. */
  logout(): void {
    const refresh_token = this.getRefreshToken();
    if (refresh_token) {
      this.http
        .post(this.apiAuth + '/logout', { refresh_token })
        .subscribe({ error: () => undefined });
    }
    this.clearSession();
  }

  storeTokens(tokens: TokenPair): void {
    if (tokens?.access_token) {
      this.setItem(ACCESS_TOKEN_KEY, tokens.access_token);
    }
    if (tokens?.refresh_token) {
      this.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token);
    }
  }

  clearSession(): void {
    this.removeItem(ACCESS_TOKEN_KEY);
    this.removeItem(REFRESH_TOKEN_KEY);
  }

  getAccessToken(): string | null {
    return this.getItem(ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return this.getItem(REFRESH_TOKEN_KEY);
  }

  getDecodedToken(): DecodedToken | null {
    const token = this.getAccessToken();
    if (!token) return null;
    try {
      return jwtDecode<DecodedToken>(token);
    } catch {
      return null;
    }
  }

  /** true se há token e ele ainda não expirou (claim `exp`). */
  isSessionValid(): boolean {
    const decoded = this.getDecodedToken();
    if (!decoded?.exp) return false;
    return decoded.exp * 1000 > Date.now();
  }

  getUserRole(): UserRole[] | null {
    return this.getDecodedToken()?.roles ?? null;
  }

  /**
   * true enquanto a senha em uso for provisória. Lido do **claim do token**, não
   * de um estado em memória — é o que impede burlar a troca obrigatória com um
   * F5 ou uma URL direta.
   */
  mustChangePassword(): boolean {
    return this.getDecodedToken()?.mustChangePassword === true;
  }

  /**
   * Define a senha definitiva. A API devolve um **par de tokens novo** (sem o
   * claim de troca obrigatória) e ele é gravado aqui — sem isso o usuário
   * continuaria preso na tela de troca com o token antigo.
   */
  changePassword(password: string): Observable<TokenPair> {
    return this.http
      .post<TokenPair>(this.apiAuth + '/change-password', { password })
      .pipe(tap((tokens) => this.storeTokens(tokens)));
  }

  get userId(): string {
    return this.getDecodedToken()?.id ?? '';
  }

  // --- storage SSR-safe ---
  private getItem(key: string): string | null {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem(key);
  }
  private setItem(key: string, value: string): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(key, value);
  }
  private removeItem(key: string): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(key);
  }
}
