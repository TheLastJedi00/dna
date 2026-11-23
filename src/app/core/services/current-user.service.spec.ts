import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CurrentUserService } from './current-user.service';
import { LoginService } from './login.service';
import { environment } from '../../../environments/environment';
import { FakeLoginService } from '../../testing/fake-login-service';

describe('CurrentUserService', () => {
  let service: CurrentUserService;
  let login: FakeLoginService;
  let http: HttpTestingController;
  const me = (id: string) => `${environment.apiUrl}/users/me/${id}`;

  function loginAs(id: string, email: string) {
    login.loginAs(id, email);
  }

  beforeEach(() => {
    login = new FakeLoginService();
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: LoginService, useValue: login },
      ],
    });
    service = TestBed.inject(CurrentUserService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('busca o perfil uma vez e expõe o nome real', async () => {
    loginAs('u1', 'maria@x.com');
    const p1 = service.ensureLoaded();
    const p2 = service.ensureLoaded();
    expect(service.state.status()).toBe('loading');
    expect(service.displayName()).toBeNull();
    http.expectOne(me('u1')).flush({ fullName: 'Maria Silva' });
    await Promise.all([p1, p2]);
    await service.ensureLoaded();
    http.expectNone(me('u1'));
    expect(service.displayName()).toBe('Maria Silva');
    expect(service.isEmailFallback()).toBeFalse();
  });

  it('sem perfil (404) usa o e-mail do token, sem erro', async () => {
    loginAs('m1', 'gestor@x.com');
    const p = service.ensureLoaded();
    http.expectOne(me('m1')).flush(null, { status: 404, statusText: 'Not Found' });
    await p;
    expect(service.state.status()).toBe('empty');
    expect(service.displayName()).toBe('gestor@x.com');
    expect(service.isEmailFallback()).toBeTrue();
  });

  it('erro de rede fica em error e o reload recupera', async () => {
    loginAs('u1', 'maria@x.com');
    let p = service.ensureLoaded();
    http.expectOne(me('u1')).error(new ProgressEvent('error'), { status: 0 });
    await p;
    expect(service.state.status()).toBe('error');
    expect(service.state.error()).toContain('Sem conexão');
    p = service.reload();
    http.expectOne(me('u1')).flush({ fullName: 'Maria Silva' });
    await p;
    expect(service.displayName()).toBe('Maria Silva');
  });

  it('limpa o perfil ao encerrar a sessão', async () => {
    loginAs('u1', 'maria@x.com');
    const p = service.ensureLoaded();
    http.expectOne(me('u1')).flush({ fullName: 'Maria Silva' });
    await p;
    login.clearSession();
    expect(service.state.status()).toBe('idle');
    expect(service.displayName()).toBeNull();
  });

  it('recarrega quando outro usuário entra', async () => {
    loginAs('u1', 'maria@x.com');
    let p = service.ensureLoaded();
    http.expectOne(me('u1')).flush({ fullName: 'Maria Silva' });
    await p;
    loginAs('u2', 'ana@x.com');
    p = service.ensureLoaded();
    http.expectOne(me('u2')).flush({ fullName: 'Ana Souza' });
    await p;
    expect(service.displayName()).toBe('Ana Souza');
  });
});
