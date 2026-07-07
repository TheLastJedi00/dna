import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { LoginService } from './login.service';
import { environment } from '../../../environments/environment';

/** Constrói um JWT falso (só o payload importa para o jwt-decode). */
function fakeJwt(payload: Record<string, unknown>): string {
  const b64 = (o: unknown) =>
    btoa(JSON.stringify(o)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${b64({ alg: 'HS256' })}.${b64(payload)}.sig`;
}

describe('LoginService', () => {
  let service: LoginService;
  let http: HttpTestingController;
  const auth = `${environment.apiUrl}/auth`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(LoginService);
    http = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  it('login guarda o par de tokens', () => {
    service.login('a@b.com', 'pw').subscribe();
    const req = http.expectOne(auth);
    expect(req.request.body).toEqual({ email: 'a@b.com', password: 'pw' });
    req.flush({ access_token: 'acc', refresh_token: 'ref' });

    expect(service.getAccessToken()).toBe('acc');
    expect(service.getRefreshToken()).toBe('ref');
  });

  it('isSessionValid: true para exp futuro, false para exp passado', () => {
    service.storeTokens({ access_token: fakeJwt({ id: '1', exp: Math.floor(Date.now() / 1000) + 3600 }) });
    expect(service.isSessionValid()).toBeTrue();

    service.storeTokens({ access_token: fakeJwt({ id: '1', exp: Math.floor(Date.now() / 1000) - 10 }) });
    expect(service.isSessionValid()).toBeFalse();
  });

  it('isSessionValid: false sem token', () => {
    expect(service.isSessionValid()).toBeFalse();
  });

  it('userId vem do token decodificado', () => {
    service.storeTokens({ access_token: fakeJwt({ id: 'user-42' }) });
    expect(service.userId).toBe('user-42');
  });

  it('refreshTokens renova e guarda o novo par', () => {
    service.storeTokens({ access_token: 'old', refresh_token: 'ref-1' });
    service.refreshTokens().subscribe();
    const req = http.expectOne(`${auth}/refresh`);
    expect(req.request.body).toEqual({ refresh_token: 'ref-1' });
    req.flush({ access_token: 'acc-2', refresh_token: 'ref-2' });

    expect(service.getAccessToken()).toBe('acc-2');
    expect(service.getRefreshToken()).toBe('ref-2');
  });

  it('refreshTokens limpa a sessão se o refresh falhar', () => {
    service.storeTokens({ access_token: 'old', refresh_token: 'ref-1' });
    service.refreshTokens().subscribe({ error: () => undefined });
    http.expectOne(`${auth}/refresh`).flush(null, { status: 401, statusText: 'Unauthorized' });

    expect(service.getAccessToken()).toBeNull();
    expect(service.getRefreshToken()).toBeNull();
  });

  it('logout revoga o refresh no backend e limpa a sessão', () => {
    service.storeTokens({ access_token: 'acc', refresh_token: 'ref-1' });
    service.logout();
    const req = http.expectOne(`${auth}/logout`);
    expect(req.request.body).toEqual({ refresh_token: 'ref-1' });
    req.flush(null);

    expect(service.getAccessToken()).toBeNull();
    expect(service.getRefreshToken()).toBeNull();
  });
});
