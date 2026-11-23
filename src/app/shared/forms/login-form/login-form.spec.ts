import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Router } from '@angular/router';
import { LoginForm } from './login-form';
import { LoginService } from '../../../core/services/login.service';

describe('LoginForm', () => {
  let fixture: ComponentFixture<LoginForm>;
  let login: jasmine.SpyObj<Pick<LoginService, 'login' | 'sendPasswordReset'>>;
  let router: jasmine.SpyObj<Router>;

  const el = () => fixture.nativeElement as HTMLElement;
  const fill = (selector: string, value: string) => {
    const input = el().querySelector<HTMLInputElement>(selector)!;
    input.value = value;
    input.dispatchEvent(new Event('input'));
  };
  const submit = async () => {
    el().querySelector('form')!.dispatchEvent(new Event('submit'));
    await fixture.whenStable();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    login = jasmine.createSpyObj('LoginService', ['login', 'sendPasswordReset']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    router.navigate.and.resolveTo(true);
    await TestBed.configureTestingModule({
      imports: [LoginForm],
      providers: [
        provideZonelessChangeDetection(),
        { provide: LoginService, useValue: login },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(LoginForm);
    fixture.detectChanges();
  });

  it('entra e vai para o dashboard', async () => {
    login.login.and.resolveTo();
    fill('#login-email', ' ana@dna.com ');
    fill('#login-password', 'segredo');
    await submit();

    expect(login.login).toHaveBeenCalledWith('ana@dna.com', 'segredo');
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('credencial errada mostra a mensagem do Firebase traduzida', async () => {
    login.login.and.rejectWith(Object.assign(new Error('x'), { code: 'auth/invalid-credential' }));
    fill('#login-email', 'ana@dna.com');
    fill('#login-password', 'errada');
    await submit();

    expect(el().querySelector('[role="alert"]')?.textContent).toContain(
      'E-mail ou senha incorretos.',
    );
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
