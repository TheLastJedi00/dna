import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { AnalystList } from './analyst-list';
import { AnalystData } from '../../../core/models/analyst.model';

describe('AnalystList', () => {
  let component: AnalystList;
  let fixture: ComponentFixture<AnalystList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalystList],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AnalystList);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('renderiza o estado vazio quando não há analistas', () => {
    fixture.componentRef.setInput('analysts', []);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Nenhum analista encontrado');
  });

  it('renderiza um cartão por analista', () => {
    const analysts: AnalystData[] = [
      { id: 'a1', fullName: 'Ana', isActive: true },
      { id: 'a2', fullName: 'Bia', isActive: false },
    ];
    fixture.componentRef.setInput('analysts', analysts);
    fixture.detectChanges();
    const items =
      fixture.nativeElement.querySelectorAll('app-analyst-item');
    expect(items.length).toBe(2);
  });

  it('repassa a seleção de um item', () => {
    const analyst: AnalystData = { id: 'a1', fullName: 'Ana', isActive: true };
    fixture.componentRef.setInput('analysts', [analyst]);
    fixture.detectChanges();

    let selected: AnalystData | undefined;
    component.select.subscribe((a) => (selected = a));

    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('app-analyst-item button');
    button.click();

    expect(selected).toEqual(analyst);
  });
});
