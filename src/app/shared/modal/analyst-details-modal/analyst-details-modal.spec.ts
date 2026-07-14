import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { AnalystDetailsModal } from './analyst-details-modal';
import { AnalystData } from '../../../core/models/analyst.model';

describe('AnalystDetailsModal', () => {
  let component: AnalystDetailsModal;
  let fixture: ComponentFixture<AnalystDetailsModal>;
  const analyst: AnalystData = {
    id: 'a1',
    fullName: 'Ana',
    email: 'ana@dna.com',
    isActive: true,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalystDetailsModal],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AnalystDetailsModal);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('analyst', analyst);
    fixture.componentRef.setInput('isOpen', true);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('lista as Maestras vinculadas com nome e status', () => {
    fixture.componentRef.setInput('maestras', [
      { fullName: 'Maria', isActive: true },
      { fullName: 'Joana', isActive: false },
    ]);
    fixture.detectChanges();

    const text: string = fixture.nativeElement.textContent;
    expect(text).toContain('Maestras Vinculadas');
    expect(text).toContain('Maria');
    expect(text).toContain('Joana');
    expect(text).toContain('Ativa');
    expect(text).toContain('Inativa');
  });

  it('não expõe ação nem link para o detalhe das Maestras vinculadas', () => {
    fixture.componentRef.setInput('maestras', [
      { fullName: 'Maria', isActive: true },
    ]);
    fixture.detectChanges();

    const item: HTMLElement = fixture.nativeElement.querySelector('ul li');
    expect(item.querySelector('button')).toBeNull();
    expect(item.querySelector('a')).toBeNull();
  });

  it('avisa quando o Analista ainda não cadastrou Maestras', () => {
    fixture.componentRef.setInput('maestras', []);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain(
      'Nenhuma Maestra cadastrada por este Analista',
    );
  });

  it('emite disable e edit quando o Analista está ativo', () => {
    fixture.detectChanges();
    let disabled = false;
    let edited = false;
    component.disable.subscribe(() => (disabled = true));
    component.edit.subscribe(() => (edited = true));

    const buttons: HTMLButtonElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('app-icon-text-button button'),
    );
    buttons.find((b) => b.textContent?.includes('Editar'))!.click();
    buttons.find((b) => b.textContent?.includes('Desativar'))!.click();

    expect(edited).toBeTrue();
    expect(disabled).toBeTrue();
  });

  it('oferece reativar (e não desativar) quando o Analista está inativo', () => {
    fixture.componentRef.setInput('analyst', { ...analyst, isActive: false });
    fixture.detectChanges();

    let reactivated = false;
    component.reactivate.subscribe(() => (reactivated = true));

    const buttons: HTMLButtonElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('app-icon-text-button button'),
    );
    expect(buttons.some((b) => b.textContent?.includes('Desativar'))).toBeFalse();
    buttons.find((b) => b.textContent?.includes('Reativar'))!.click();

    expect(reactivated).toBeTrue();
  });
});
