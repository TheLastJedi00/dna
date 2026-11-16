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
import { errorInterceptor, SHOW_ERROR_MODAL } from './error-interceptor';
import { ErrorService } from '../services/error.service';

describe('errorInterceptor', () => {
  let http: HttpClient;
  let ctrl: HttpTestingController;
  let errorService: ErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    ctrl = TestBed.inject(HttpTestingController);
    errorService = TestBed.inject(ErrorService);
    spyOn(errorService, 'show');
  });

  afterEach(() => ctrl.verify());

  it('ação com 4xx mostra o modal com a mensagem do servidor', () => {
    http.patch('/api/x', {}).subscribe({ error: () => undefined });
    ctrl
      .expectOne('/api/x')
      .flush({ message: 'Maestra já está ativa.' }, { status: 409, statusText: 'Conflict' });
    expect(errorService.show).toHaveBeenCalledWith('Maestra já está ativa.');
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
