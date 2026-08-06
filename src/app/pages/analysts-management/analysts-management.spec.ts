import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { AnalystsManagement } from './analysts-management';
import { environment } from '../../../environments/environment';

describe('AnalystsManagement', () => {
  let component: AnalystsManagement;
  let fixture: ComponentFixture<AnalystsManagement>;
  let http: HttpTestingController;
  const api = `${environment.apiUrl}/analysts`;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalystsManagement],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AnalystsManagement);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
  });

  /** Responde à listagem em voo e devolve os itens à página. */
  const flushList = (items: unknown[] = [], headers: Record<string, string> = {}) => {
    const req = http.expectOne((r) => r.url === api && r.method === 'GET');
    req.flush(items, { headers });
  };

  /**
   * Esvazia a fila de microtasks. Depois de responder a uma mutação, o `load()`
   * seguinte só dispara quando o `await` da página é retomado — sem isto o
   * `expectOne` da recarga correria antes da requisição existir.
   */
  const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('carrega a primeira página de analistas no init', async () => {
    fixture.detectChanges();
    flushList([{ id: 'a1', fullName: 'Ana', isActive: true }], {
      'X-Total-Count': '1',
      'X-Page': '1',
      'X-Page-Size': '9',
      'X-Total-Pages': '1',
    });
    await fixture.whenStable();

    expect(component.analysts().length).toBe(1);
    expect(component.total()).toBe(1);
    expect(component.isLoading()).toBeFalse();
  });

  it('trocar o filtro de status volta para a página 1 e recarrega', async () => {
    fixture.detectChanges();
    flushList();
    await fixture.whenStable();

    component.page.set(3);
    component.setStatus('inactive');
    const req = http.expectOne((r) => r.url === api && r.method === 'GET');
    expect(req.request.params.get('status')).toBe('inactive');
    expect(req.request.params.get('page')).toBe('1');
    req.flush([]);
    await fixture.whenStable();

    expect(component.status()).toBe('inactive');
  });

  it('abrir o detalhe busca as credenciais e as Maestras vinculadas', async () => {
    fixture.detectChanges();
    flushList();
    await fixture.whenStable();

    const promise = component.openDetails({
      id: 'a1',
      fullName: 'Ana',
      isActive: true,
    });
    // O e-mail e a senha provisória só existem no detalhe — nunca na listagem.
    http.expectOne(`${api}/a1`).flush({
      id: 'a1',
      fullName: 'Ana',
      isActive: true,
      email: 'ana@dna.com',
      mustChangePassword: true,
      tempPassword: 'provisoria',
    });
    http.expectOne(`${api}/a1/maestras`).flush([
      { fullName: 'Maria', isActive: true },
    ]);
    await promise;

    expect(component.selected()?.email).toBe('ana@dna.com');
    expect(component.selected()?.tempPassword).toBe('provisoria');
    expect(component.linkedMaestras()).toEqual([
      { fullName: 'Maria', isActive: true },
    ]);
    expect(component.isLoadingMaestras()).toBeFalse();
  });

  it('gerar a senha temporária recarrega o detalhe e passa a exibi-la', async () => {
    fixture.detectChanges();
    flushList();
    await fixture.whenStable();

    component.selected.set({ id: 'a1', fullName: 'Ana', isActive: true });
    const promise = component.generateTempPassword('nova123');

    const patch = http.expectOne(`${api}/a1/temp-password`);
    expect(patch.request.method).toBe('PATCH');
    expect(patch.request.body).toEqual({ password: 'nova123' });
    patch.flush(null);
    await tick();

    http.expectOne(`${api}/a1`).flush({
      id: 'a1',
      fullName: 'Ana',
      isActive: true,
      mustChangePassword: true,
      tempPassword: 'nova123',
    });
    await promise;

    expect(component.selected()?.tempPassword).toBe('nova123');
  });

  it('salvar em modo criação chama POST e recarrega a lista', async () => {
    fixture.detectChanges();
    flushList();
    await fixture.whenStable();

    const promise = component.onFormSaved({
      fullName: 'Ana',
      login: { email: 'ana@dna.com', password: '123' },
    });
    const post = http.expectOne((r) => r.url === api && r.method === 'POST');
    expect(post.request.body).toEqual({
      fullName: 'Ana',
      login: { email: 'ana@dna.com', password: '123' },
    });
    post.flush({});
    await tick();
    flushList([{ id: 'a1', fullName: 'Ana', isActive: true }]);
    await promise;

    expect(component.isFormOpen()).toBeFalse();
    expect(component.analysts().length).toBe(1);
  });

  it('salvar em modo edição chama PATCH no analista em edição', async () => {
    fixture.detectChanges();
    flushList();
    await fixture.whenStable();

    component.editing.set({ id: 'a1', fullName: 'Ana', isActive: true });
    const promise = component.onFormSaved({ fullName: 'Ana Maria' });
    const patch = http.expectOne(`${api}/a1`);
    expect(patch.request.method).toBe('PATCH');
    expect(patch.request.body).toEqual({ fullName: 'Ana Maria' });
    patch.flush({});
    await tick();
    flushList();
    await promise;

    expect(component.editing()).toBeNull();
  });

  it('desativar o analista selecionado chama DELETE e fecha o detalhe', async () => {
    fixture.detectChanges();
    flushList();
    await fixture.whenStable();

    component.selected.set({ id: 'a1', fullName: 'Ana', isActive: true });
    const promise = component.disableAnalyst();
    const del = http.expectOne(`${api}/a1`);
    expect(del.request.method).toBe('DELETE');
    del.flush({});
    await tick();
    flushList();
    await promise;

    expect(component.selected()).toBeNull();
  });

  it('reativar o analista selecionado chama PATCH /reactivate', async () => {
    fixture.detectChanges();
    flushList();
    await fixture.whenStable();

    component.selected.set({ id: 'a1', fullName: 'Ana', isActive: false });
    const promise = component.reactivateAnalyst();
    const req = http.expectOne(`${api}/a1/reactivate`);
    expect(req.request.method).toBe('PATCH');
    req.flush({});
    await tick();
    flushList();
    await promise;

    expect(component.selected()).toBeNull();
  });
});
