import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ChangePasswordForm } from './change-password-form';
import { LoginService } from '../../../core/services/login.service';

describe('ChangePasswordForm', () => {
  let fixture: ComponentFixture<ChangePasswordForm>;
  let login: jasmine.SpyObj<Pick<LoginService, 'changePassword'>>;

  const el = () => fixture.nativeElement as HTMLElement;
  const fill = (id: string, value: string) => {
    const input = el().querySelector<HTMLInputElement>(`#${id}`)!;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('blur'));
  };
  const submit = async () => {
    el().querySelector('form')!.dispatchEvent(new Event('submit'));
    await fixture.whenStable();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    login = jasmine.createSpyObj('LoginService', ['changePassword']);
    await TestBed.configureTestingModule({
      imports: [ChangePasswordForm],
      providers: [provideZonelessChangeDetection(), { provide: LoginService, useValue: login }],
    }).compileComponents();
    fixture = TestBed.createComponent(ChangePasswordForm);
    fixture.detectChanges();
  });

  it('troca a senha com a atual e confirma', async () => {
    login.changePassword.and.resolveTo();
    fill('pw-current', 'antiga1');
    fill('pw-next', 'nova123');
    fill('pw-confirm', 'nova123');
    await submit();

    expect(login.changePassword).toHaveBeenCalledWith('antiga1', 'nova123');
    expect(el().querySelector('[role="status"]')?.textContent).toContain('Senha alterada');
  });

  it('não envia se as senhas novas forem diferentes', async () => {
    fill('pw-current', 'antiga1');
    fill('pw-next', 'nova123');
    fill('pw-confirm', 'outra12');
    await submit();

    expect(login.changePassword).not.toHaveBeenCalled();
    expect(el().textContent).toContain('As senhas não são iguais.');
  });

  it('não envia nova senha curta', async () => {
    fill('pw-current', 'antiga1');
    fill('pw-next', '123');
    fill('pw-confirm', '123');
    await submit();
    expect(login.changePassword).not.toHaveBeenCalled();
  });

  it('senha atual errada: avisa sem fechar', async () => {
    login.changePassword.and.rejectWith(
      Object.assign(new Error('x'), { code: 'auth/invalid-credential' }),
    );
    fill('pw-current', 'errada1');
    fill('pw-next', 'nova123');
    fill('pw-confirm', 'nova123');
    await submit();

    expect(el().querySelector('[role="alert"]')?.textContent).toContain('Senha atual incorreta.');
  });
});
