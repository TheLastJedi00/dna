import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { AnalystForm, AnalystFormValue } from './analyst-form';

describe('AnalystForm', () => {
  let component: AnalystForm;
  let fixture: ComponentFixture<AnalystForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalystForm],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AnalystForm);
    component = fixture.componentInstance;
  });

  const setValue = (name: string, value: string) => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector(
      `input[formControlName="${name}"]`,
    );
    input.value = value;
    input.dispatchEvent(new Event('input'));
  };

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('na criação, emite nome e credenciais', () => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();

    let saved: AnalystFormValue | undefined;
    component.save.subscribe((v) => (saved = v));

    setValue('fullName', 'Ana');
    setValue('email', 'ana@dna.com');
    setValue('password', 'segredo');
    fixture.detectChanges();

    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));

    expect(saved).toEqual({
      fullName: 'Ana',
      login: { email: 'ana@dna.com', password: 'segredo' },
    });
  });

  it('na edição, não pede acessos e emite só o nome', () => {
    fixture.componentRef.setInput('analyst', {
      id: 'a1',
      fullName: 'Ana',
      isActive: true,
    });
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('input[formControlName="email"]'),
    ).toBeNull();

    let saved: AnalystFormValue | undefined;
    component.save.subscribe((v) => (saved = v));

    setValue('fullName', 'Ana Maria');
    fixture.detectChanges();
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));

    expect(saved).toEqual({ fullName: 'Ana Maria' });
  });

  it('não emite save com o formulário inválido', () => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();

    let saved = false;
    component.save.subscribe(() => (saved = true));

    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));

    expect(saved).toBeFalse();
  });

  it('esconde o gatilho quando showTrigger é false', () => {
    fixture.componentRef.setInput('showTrigger', false);
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('app-icon-text-button'),
    ).toBeNull();
  });
});
