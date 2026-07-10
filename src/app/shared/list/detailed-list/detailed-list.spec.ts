import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

import { DetailedList } from './detailed-list';

describe('DetailedList', () => {
  let component: DetailedList;
  let fixture: ComponentFixture<DetailedList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailedList],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailedList);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('renderiza o estado vazio quando users é []', () => {
    fixture.componentRef.setInput('users', []);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Nenhuma maestra encontrada');
  });
});
