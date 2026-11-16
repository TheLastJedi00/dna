import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { PillarLoad } from './pillar-load';

describe('PillarLoad', () => {
  let fixture: ComponentFixture<PillarLoad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PillarLoad],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(PillarLoad);
    fixture.componentRef.setInput('pillar', 'a Astrologia');
  });

  const text = () => (fixture.nativeElement as HTMLElement).textContent ?? '';

  it('vazio não é erro', async () => {
    fixture.componentRef.setInput('status', 'empty');
    fixture.componentRef.setInput('emptyMessage', 'Ainda não cadastrada.');
    await fixture.whenStable();
    expect(text()).toContain('Ainda não cadastrada.');
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeNull();
  });

  it('erro mostra título com o pilar e a mensagem', async () => {
    fixture.componentRef.setInput('status', 'error');
    fixture.componentRef.setInput('error', 'Sem conexão com o servidor.');
    await fixture.whenStable();
    expect(text()).toContain('Não foi possível carregar a Astrologia');
    expect(text()).toContain('Sem conexão com o servidor.');
  });

  it('em success não desenha nada', async () => {
    fixture.componentRef.setInput('status', 'success');
    await fixture.whenStable();
    expect(text().trim()).toBe('');
  });
});
