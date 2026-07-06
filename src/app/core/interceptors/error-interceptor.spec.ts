import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { errorInterceptor } from './error-interceptor';
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

  it('mostra o modal em erro 500 com a mensagem do servidor', () => {
    http.get('/api/x').subscribe({ error: () => undefined });
    ctrl
      .expectOne('/api/x')
      .flush({ message: 'Boom' }, { status: 500, statusText: 'Server Error' });
    expect(errorService.show).toHaveBeenCalledWith('Boom');
  });

  it('ignora 401 em rota protegida (authInterceptor trata)', () => {
    http.get('/api/protected').subscribe({ error: () => undefined });
    ctrl
      .expectOne('/api/protected')
      .flush(null, { status: 401, statusText: 'Unauthorized' });
    expect(errorService.show).not.toHaveBeenCalled();
  });

  it('mostra 401 em endpoint de auth (credenciais inválidas)', () => {
    http.post('/auth', {}).subscribe({ error: () => undefined });
    ctrl
      .expectOne('/auth')
      .flush(
        { message: 'Senha inválida.' },
        { status: 401, statusText: 'Unauthorized' },
      );
    expect(errorService.show).toHaveBeenCalledWith('Senha inválida.');
  });

  it('usa mensagem genérica quando não há conexão (status 0)', () => {
    http.get('/api/x').subscribe({ error: () => undefined });
    ctrl.expectOne('/api/x').error(new ProgressEvent('error'), { status: 0 });
    expect(errorService.show).toHaveBeenCalled();
  });
});
