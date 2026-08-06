import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { Management } from './management';
import { environment } from '../../../environments/environment';

describe('Management', () => {
  let component: Management;
  let fixture: ComponentFixture<Management>;
  let http: HttpTestingController;
  const api = `${environment.apiUrl}/users`;

  const flushList = (items: unknown[] = []) => {
    const req = http.expectOne((r) => r.url.startsWith(`${api}/active`));
    req.flush(items);
  };

  /** Esvazia a fila de microtasks entre uma mutação e a recarga que a segue. */
  const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Management],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Management);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.componentRef.setInput('type', 'maestras');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('abrir o detalhe busca as credenciais da Maestra', async () => {
    fixture.detectChanges();
    flushList();
    await fixture.whenStable();

    const promise = component.openDetails({
      id: 'u1',
      fullName: 'Ana',
      birthDate: '2000-01-01',
      birthTime: '00:00',
      birthPlace: 'Floripa-SC',
    });
    // E-mail e senha provisória só existem no detalhe — nunca na listagem.
    http.expectOne(`${api}/u1`).flush({
      id: 'u1',
      fullName: 'Ana',
      email: 'ana@dna.com',
      mustChangePassword: true,
      tempPassword: 'provisoria',
    });
    await promise;

    expect(component.selected()?.email).toBe('ana@dna.com');
    expect(component.selected()?.tempPassword).toBe('provisoria');
    expect(component.isLoadingDetails()).toBeFalse();
  });

  it('gerar a senha temporária recarrega o detalhe e passa a exibi-la', async () => {
    fixture.detectChanges();
    flushList();
    await fixture.whenStable();

    component.selected.set({
      id: 'u1',
      fullName: 'Ana',
      birthDate: '2000-01-01',
      birthTime: '00:00',
      birthPlace: 'Floripa-SC',
    });

    const promise = component.generateTempPassword('nova123');
    const patch = http.expectOne(`${api}/u1/temp-password`);
    expect(patch.request.method).toBe('PATCH');
    expect(patch.request.body).toEqual({ password: 'nova123' });
    patch.flush(null);
    await tick();

    http.expectOne(`${api}/u1`).flush({
      id: 'u1',
      fullName: 'Ana',
      mustChangePassword: true,
      tempPassword: 'nova123',
    });
    await promise;

    expect(component.selected()?.tempPassword).toBe('nova123');
  });

  it('desativar a Maestra selecionada fecha o detalhe e recarrega', async () => {
    fixture.detectChanges();
    flushList();
    await fixture.whenStable();

    component.selected.set({
      id: 'u1',
      fullName: 'Ana',
      birthDate: '2000-01-01',
      birthTime: '00:00',
      birthPlace: 'Floripa-SC',
    });

    const promise = component.disableUser();
    const del = http.expectOne(`${api}/u1`);
    expect(del.request.method).toBe('DELETE');
    del.flush({});
    await tick();
    flushList();
    await promise;

    expect(component.selected()).toBeNull();
  });
});
