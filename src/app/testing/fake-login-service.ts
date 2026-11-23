import { signal } from '@angular/core';
import { Subject } from 'rxjs';
import { UserRole } from '../types/types';

/**
 * `LoginService` falso para specs (spec 010): a sessão é do Firebase, então os
 * testes não montam mais um JWT no localStorage — chamam `loginAs`.
 */
export class FakeLoginService {
  private readonly session = signal<{
    id: string;
    email: string;
    roles: UserRole[];
    emailVerified: boolean;
  } | null>(null);
  private readonly cleared = new Subject<void>();
  readonly sessionCleared$ = this.cleared.asObservable();

  loginAs(id: string, email: string, roles: UserRole[] = ['USER'], emailVerified = true) {
    this.session.set({ id, email, roles, emailVerified });
  }

  whenReady(): Promise<void> {
    return Promise.resolve();
  }
  isSessionValid(): boolean {
    return this.session() !== null;
  }
  getUserRole(): UserRole[] | null {
    return this.session()?.roles ?? null;
  }
  isEmailVerified(): boolean {
    return this.session()?.emailVerified ?? false;
  }
  emailVerified = () => this.isEmailVerified();
  get userId(): string {
    return this.session()?.id ?? '';
  }
  get email(): string {
    return this.session()?.email ?? '';
  }
  getIdToken(): Promise<string | null> {
    return Promise.resolve(this.session() ? 'token' : null);
  }
  clearSession(): void {
    this.session.set(null);
    this.cleared.next();
  }
  logout(): Promise<void> {
    this.clearSession();
    return Promise.resolve();
  }
}
