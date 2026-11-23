import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ChangeEmailForm } from './change-email-form';
import { LoginService } from '../../../core/services/login.service';

describe('ChangeEmailForm', () => {
  let fixture: ComponentFixture<ChangeEmailForm>;
  let login: jasmine.SpyObj<Pick<LoginService, 'changeEmail'>> & { email: string };

  const el = () => fixture.nativeElement as HTMLElement;
  const fill = (id: string, value: string) => {
    const input = el().querySelector<HTMLInputElement>(`#${id}`)!;
    input.value = value;
    input.dispatchEvent(new Event('input'));
  };
  const submit = async () => {
    el().querySelector('form')!.dispatchEvent(new Event('submit'));
    await fixture.whenStable();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    login = Object.assign(jasmine.createSpyObj('LoginService', ['changeEmail']), {
      email: 'ana@dna.com',
    });
    await TestBed.configureTestingModule({
      imports: [ChangeEmailForm],
      providers: [provideZonelessChangeDetection(), { provide: LoginService, useValue: login }],
    }).compileComponents();
    fixture = TestBed.createComponent(ChangeEmailForm);
    fixture.detectChanges();
  });

  it('avisa antes que o e-mail só muda depois do link', () => {
    expect(el().textContent).toContain('O e-mail só muda quando você abrir esse link');
  });

  it('envia o link para o novo e-mail e diz que o atual segue valendo', async () => {
    login.changeEmail.and.resolveTo();
    fill('email-new', ' nova@dna.com ');
    fill('email-password', 'segredo');
    await submit();

    expect(login.changeEmail).toHaveBeenCalledWith('segredo', 'nova@dna.com');
    const status = el().querySelector('[role="status"]')?.textContent ?? '';
    expect(status).toContain('nova@dna.com');
    expect(status).toContain('ana@dna.com');
  });

  it('mesmo e-mail atual: não envia', async () => {
    fill('email-new', 'ANA@dna.com');
    fill('email-password', 'segredo');
    await submit();
    expect(login.changeEmail).not.toHaveBeenCalled();
    expect(el().querySelector('[role="alert"]')?.textContent).toContain('Este já é o seu e-mail.');
  });

  it('senha atual errada: avisa', async () => {
    login.changeEmail.and.rejectWith(
      Object.assign(new Error('x'), { code: 'auth/invalid-credential' }),
    );
    fill('email-new', 'nova@dna.com');
    fill('email-password', 'errada');
    await submit();
    expect(el().querySelector('[role="alert"]')?.textContent).toContain('Senha atual incorreta.');
  });
});
