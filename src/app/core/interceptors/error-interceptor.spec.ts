import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import {
  HttpClient,
  HttpContext,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { errorInterceptor, SHOW_ERROR_MODAL } from './error-interceptor';
import { ErrorService } from '../services/error.service';
import { LoginService } from '../services/login.service';

describe('errorInterceptor', () => {
  let http: HttpClient;
  let ctrl: HttpTestingController;
  let errorService: ErrorService;
  let login: jasmine.SpyObj<Pick<LoginService, 'markEmailUnverified'>>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    login = jasmine.createSpyObj('LoginService', ['markEmailUnverified']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        { provide: LoginService, useValue: login },
        { provide: Router, useValue: router },
      ],
    });
    http = TestBed.inject(HttpClient);
    ctrl = TestBed.inject(HttpTestingController);
    errorService = TestBed.inject(ErrorService);
    spyOn(errorService, 'show');
  });

  afterEach(() => ctrl.verify());

  it('403 EMAIL_NOT_VERIFIED: reabre o popup no dashboard, sem modal de erro', () => {
    http.post('/api/x', {}).subscribe({ error: () => undefined });
    ctrl.expectOne('/api/x').flush(
      { code: 'EMAIL_NOT_VERIFIED', message: 'Verifique seu e-mail para continuar.' },
      { status: 403, statusText: 'Forbidden' },
    );
    expect(login.markEmailUnverified).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(errorService.show).not.toHaveBeenCalled();
  });

  it('outro 403 segue a regra normal (ação abre o modal)', () => {
    http.post('/api/x', {}).subscribe({ error: () => undefined });
    ctrl.expectOne('/api/x').flush(
      { message: 'Sem permissão.' },
      { status: 403, statusText: 'Forbidden' },
    );
    expect(login.markEmailUnverified).not.toHaveBeenCalled();
    expect(errorService.show).toHaveBeenCalled();
  });

  it('ação com 4xx mostra o modal com a mensagem do servidor', () => {
    http.patch('/api/x', {}).subscribe({ error: () => undefined });
    ctrl
      .expectOne('/api/x')
      .flush({ message: 'Usuário já está ativo.' }, { status: 409, statusText: 'Conflict' });
    expect(errorService.show).toHaveBeenCalledWith('Usuário já está ativo.');
  });

  it('ação com 5xx mostra o modal com texto claro, sem o detalhe interno', () => {
    http.post('/api/x', {}).subscribe({ error: () => undefined });
    ctrl.expectOne('/api/x').flush({ message: 'Boom' }, { status: 500, statusText: 'Server Error' });
    expect(errorService.show).toHaveBeenCalledWith(
      'O servidor está com instabilidade. Tente novamente em instantes.',
    );
  });

  it('leitura (GET) não abre o modal — a tela mostra o erro inline', () => {
    http.get('/api/x').subscribe({ error: () => undefined });
    ctrl.expectOne('/api/x').flush(null, { status: 500, statusText: 'Server Error' });
    expect(errorService.show).not.toHaveBeenCalled();
  });

  it('SHOW_ERROR_MODAL força o modal numa leitura', () => {
    const context = new HttpContext().set(SHOW_ERROR_MODAL, true);
    http.get('/api/x', { context }).subscribe({ error: () => undefined });
    ctrl.expectOne('/api/x').flush(null, { status: 404, statusText: 'Not Found' });
    expect(errorService.show).toHaveBeenCalled();
  });

  it('SHOW_ERROR_MODAL silencia uma ação', () => {
    const context = new HttpContext().set(SHOW_ERROR_MODAL, false);
    http.post('/api/x', {}, { context }).subscribe({ error: () => undefined });
    ctrl.expectOne('/api/x').flush(null, { status: 500, statusText: 'Server Error' });
    expect(errorService.show).not.toHaveBeenCalled();
  });

  it('ignora 401 em rota protegida (authInterceptor trata)', () => {
    http.post('/api/protected', {}).subscribe({ error: () => undefined });
    ctrl.expectOne('/api/protected').flush(null, { status: 401, statusText: 'Unauthorized' });
    expect(errorService.show).not.toHaveBeenCalled();
  });

  it('mostra 401 em endpoint de auth (credenciais inválidas)', () => {
    http.post('/auth', {}).subscribe({ error: () => undefined });
    ctrl
      .expectOne('/auth')
      .flush({ message: 'Senha inválida.' }, { status: 401, statusText: 'Unauthorized' });
    expect(errorService.show).toHaveBeenCalledWith('Senha inválida.');
  });

  it('ação sem conexão (status 0) mostra a mensagem de rede', () => {
    http.post('/api/x', {}).subscribe({ error: () => undefined });
    ctrl.expectOne('/api/x').error(new ProgressEvent('error'), { status: 0 });
    expect(errorService.show).toHaveBeenCalledWith(
      'Sem conexão com o servidor. Verifique sua internet e tente novamente.',
    );
  });
});
