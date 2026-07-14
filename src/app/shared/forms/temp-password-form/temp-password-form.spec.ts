import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { TempPasswordForm } from './temp-password-form';

/** Os dois estados do bloco de senha no detalhe do usuário (spec 005). */
describe('TempPasswordForm', () => {
  let component: TempPasswordForm;
  let fixture: ComponentFixture<TempPasswordForm>;

  const buttons = (): HTMLButtonElement[] =>
    Array.from(fixture.nativeElement.querySelectorAll('button'));
  const buttonWith = (text: string) =>
    buttons().find((b) => b.textContent?.includes(text));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TempPasswordForm],
      providers: [provideZonelessChangeDetection(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(TempPasswordForm);
    component = fixture.componentInstance;
  });

  it('estado 2 (aguardando troca): exibe a senha e o aviso, sem botão de gerar', () => {
    fixture.componentRef.setInput('mustChangePassword', true);
    fixture.componentRef.setInput('tempPassword', 'provisoria123');
    fixture.componentRef.setInput('subject', 'a usuária');
    fixture.detectChanges();

    const text: string = fixture.nativeElement.textContent;
    expect(text).toContain('provisoria123');
    expect(text).toContain(
      'Esta senha é temporária até a usuária redefinir sua nova senha.',
    );
    expect(buttonWith('Gerar senha temporária')).toBeUndefined();
  });

  it('estado 1 (senha definida): oferece gerar uma senha temporária', () => {
    fixture.componentRef.setInput('mustChangePassword', false);
    fixture.componentRef.setInput('tempPassword', null);
    fixture.detectChanges();

    expect(buttonWith('Gerar senha temporária')).toBeDefined();
    expect(fixture.nativeElement.textContent).not.toContain('temporária até');
  });

  it('emite a senha digitada e volta ao estado inicial', () => {
    fixture.componentRef.setInput('mustChangePassword', false);
    fixture.detectChanges();

    let saved: string | undefined;
    component.save.subscribe((p) => (saved = p));

    buttonWith('Gerar senha temporária')!.click();
    fixture.detectChanges();

    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input[formControlName="password"]');
    input.value = 'nova123';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));

    expect(saved).toBe('nova123');
    expect(component.isTyping()).toBeFalse();
  });

  it('não emite senha inválida (curta demais)', () => {
    fixture.componentRef.setInput('mustChangePassword', false);
    fixture.detectChanges();

    let saved = false;
    component.save.subscribe(() => (saved = true));

    buttonWith('Gerar senha temporária')!.click();
    fixture.detectChanges();

    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input[formControlName="password"]');
    input.value = '123';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));

    expect(saved).toBeFalse();
  });
});
