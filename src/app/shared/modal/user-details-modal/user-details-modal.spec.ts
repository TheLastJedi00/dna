import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { UserDetailsModal } from './user-details-modal';
import { UserData } from '../../../core/models/userdata.model';

const MAESTRA: UserData = {
  id: 'u1',
  fullName: 'Ana',
  birthDate: '2000-01-01',
  birthTime: '00:00',
  birthPlace: 'Floripa-SC',
  isActive: true,
};

describe('UserDetailsModal', () => {
  let component: UserDetailsModal;
  let fixture: ComponentFixture<UserDetailsModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDetailsModal],
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserDetailsModal);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('userData', MAESTRA);
    fixture.componentRef.setInput('isOpen', true);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('maestra ativa mostra Editar e Desativar', () => {
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Editar');
    expect(text).toContain('Desativar');
    expect(text).not.toContain('Reativar');
  });

  it('maestra inativa mostra Reativar', () => {
    fixture.componentRef.setInput('userData', { ...MAESTRA, isActive: false });
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Reativar');
    expect(text).not.toContain('Desativar');
  });

  describe('quem cadastrou', () => {
    const creatorText = (data: Partial<UserData>) => {
      fixture.componentRef.setInput('userData', { ...MAESTRA, ...data });
      fixture.detectChanges();
      return component.creatorText();
    };

    it('mostra o nome de quem cadastrou', () => {
      expect(creatorText({ createdBy: 'a1', createdByName: 'Bia' })).toBe('Bia');
    });

    it('criador que excluiu a conta: "Conta removida"', () => {
      expect(creatorText({ createdBy: 'a1', createdByName: null })).toBe('Conta removida');
    });

    it('cadastro antigo, sem vínculo: "Não informado"', () => {
      expect(creatorText({ createdBy: undefined, createdByName: null })).toBe('Não informado');
    });
  });
});

