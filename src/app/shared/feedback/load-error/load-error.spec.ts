import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { LoadError } from './load-error';

describe('LoadError', () => {
  let fixture: ComponentFixture<LoadError>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadError],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(LoadError);
    fixture.componentRef.setInput('message', 'Sem conexão com o servidor.');
    await fixture.whenStable();
  });

  it('anuncia a mensagem como alerta', () => {
    const alert: HTMLElement = fixture.nativeElement.querySelector('[role="alert"]');
    expect(alert.textContent).toContain('Sem conexão com o servidor.');
  });

  it('emite retry ao clicar em "Tentar novamente"', () => {
    let retried = false;
    fixture.componentInstance.retry.subscribe(() => (retried = true));
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.textContent).toContain('Tentar novamente');
    button.click();
    expect(retried).toBeTrue();
  });
});
