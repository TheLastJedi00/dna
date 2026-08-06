import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';

import { ChangePassword } from './change-password';
import { environment } from '../../../environments/environment';

describe('ChangePassword', () => {
  let component: ChangePassword;
  let fixture: ComponentFixture<ChangePassword>;
  let http: HttpTestingController;
  let router: Router;
  const url = `${environment.apiUrl}/auth/change-password`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangePassword],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangePassword);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.resolveTo(true);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('salva a senha definitiva e libera o painel', async () => {
    const promise = component.onSave('definitiva');

    const req = http.expectOne(url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ password: 'definitiva' });
    // A API devolve tokens novos, já sem o claim de troca obrigatória.
    req.flush({ access_token: 'novo', refresh_token: 'novo-refresh' });
    await promise;

    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(component.error()).toBeNull();
  });

  it('erro da API não libera a navegação', async () => {
    const promise = component.onSave('curta');

    http
      .expectOne(url)
      .flush(
        { message: 'Senha muito curta.' },
        { status: 400, statusText: 'Bad Request' },
      );
    await promise;

    expect(router.navigate).not.toHaveBeenCalled();
    expect(component.error()).toBe('Senha muito curta.');
    expect(component.isLoading()).toBeFalse();
  });

  it('o modal é estático: não há como fechá-lo sem trocar a senha', () => {
    const el: HTMLElement = fixture.nativeElement;
    const labels = Array.from(el.querySelectorAll('button')).map((b) =>
      b.textContent?.trim(),
    );

    // Só "Salvar senha" e o escape explícito por logout. Nada de "Voltar"/"Fechar".
    expect(labels).not.toContain('Voltar');
    expect(labels).not.toContain('Fechar');
    expect(labels.some((l) => l?.includes('Salvar senha'))).toBeTrue();
    expect(labels.some((l) => l?.includes('Sair'))).toBeTrue();
  });
});
