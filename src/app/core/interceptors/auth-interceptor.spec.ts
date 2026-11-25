import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { authInterceptor } from './auth-interceptor';
import { LoginService } from '../services/login.service';

describe('authInterceptor (ID token do Firebase)', () => {
  let http: HttpClient;
  let backend: HttpTestingController;
  let router: jasmine.SpyObj<Router>;
  let login: { getIdToken: jasmine.Spy; clearSession: jasmine.Spy };

  /** Espera o interceptor resolver o token (Promise) e emitir a requisição. */
  const flushMicrotasks = () => new Promise((r) => setTimeout(r));

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    login = {
      getIdToken: jasmine
        .createSpy('getIdToken')
        .and.callFake((force?: boolean) => Promise.resolve(force ? 'token-novo' : 'token-1')),
      clearSession: jasmine.createSpy('clearSession'),
    };
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: Router, useValue: router },
        { provide: LoginService, useValue: login },
      ],
    });
    http = TestBed.inject(HttpClient);
    backend = TestBed.inject(HttpTestingController);
  });

  afterEach(() => backend.verify());

  it('manda o ID token no header Authorization', async () => {
    const result = firstValueFrom(http.get('/api/x'));
    await flushMicrotasks();
    const req = backend.expectOne('/api/x');
    expect(req.request.headers.get('Authorization')).toBe('Bearer token-1');
    req.flush({ ok: true });
    await expectAsync(result).toBeResolvedTo({ ok: true });
  });

  it('sem sessão, segue sem header', async () => {
    login.getIdToken.and.resolveTo(null);
    const result = firstValueFrom(http.get('/api/x'));
    await flushMicrotasks();
    const req = backend.expectOne('/api/x');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
    await result;
  });

  it('401: tenta de novo uma vez com token renovado', async () => {
    const result = firstValueFrom(http.get('/api/x'));
    await flushMicrotasks();
    backend.expectOne('/api/x').flush({}, { status: 401, statusText: 'Unauthorized' });
    await flushMicrotasks();

    const retry = backend.expectOne('/api/x');
    expect(login.getIdToken).toHaveBeenCalledWith(true);
    expect(retry.request.headers.get('Authorization')).toBe('Bearer token-novo');
    retry.flush({ ok: true });

    await expectAsync(result).toBeResolvedTo({ ok: true });
    expect(login.clearSession).not.toHaveBeenCalled();
  });

  it('401 de novo na nova tentativa: encerra a sessão e vai para o login', async () => {
    const result = firstValueFrom(http.get('/api/x'));
    await flushMicrotasks();
    backend.expectOne('/api/x').flush({}, { status: 401, statusText: 'Unauthorized' });
    await flushMicrotasks();
    backend.expectOne('/api/x').flush({}, { status: 401, statusText: 'Unauthorized' });

    await expectAsync(result).toBeRejected();
    expect(login.clearSession).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('outros erros passam direto, sem nova tentativa', async () => {
    const result = firstValueFrom(http.get('/api/x'));
    await flushMicrotasks();
    backend.expectOne('/api/x').flush({}, { status: 500, statusText: 'Erro' });

    await expectAsync(result).toBeRejected();
    expect(login.getIdToken).toHaveBeenCalledTimes(1);
    expect(login.clearSession).not.toHaveBeenCalled();
  });
});
