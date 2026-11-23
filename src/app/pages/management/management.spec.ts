import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { InviteService } from '../../core/services/invite.service';

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

  let invite: { send: jasmine.Spy };

  beforeEach(async () => {
    invite = { send: jasmine.createSpy('send').and.resolveTo(true) };
    await TestBed.configureTestingModule({
      imports: [Management],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: InviteService, useValue: invite },
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
    // E-mail e status do acesso só existem no detalhe — nunca na listagem.
    http.expectOne(`${api}/u1`).flush({
      id: 'u1',
      fullName: 'Ana',
      email: 'ana@dna.com',
      accessStatus: 'invite_pending',
    });
    await promise;

    expect(component.selected()?.email).toBe('ana@dna.com');
    expect(component.selected()?.accessStatus).toBe('invite_pending');
    expect(component.detail.isLoading()).toBeFalse();
  });

  it('reenviar convite manda o "Defina sua senha" para o e-mail do detalhe', async () => {
    component.selected.set({
      id: 'u1',
      fullName: 'Ana',
      birthDate: '2000-01-01',
      birthTime: '00:00',
      birthPlace: 'Floripa-SC',
      email: 'ana@dna.com',
    });

    await component.resendInvite();

    expect(invite.send).toHaveBeenCalledWith('ana@dna.com');
    expect(component.isResending()).toBeFalse();
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
