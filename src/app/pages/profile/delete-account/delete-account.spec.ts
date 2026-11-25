import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { DeleteAccount } from './delete-account';
import { LoginService } from '../../../core/services/login.service';
import { UserService } from '../../../core/services/user.service';
import { ToastService } from '../../../core/services/toast.service';

describe('DeleteAccount', () => {
  let fixture: ComponentFixture<DeleteAccount>;
  let login: jasmine.SpyObj<Pick<LoginService, 'reauthenticate' | 'logout'>>;
  let users: jasmine.SpyObj<Pick<UserService, 'deleteMe'>>;
  let toast: jasmine.SpyObj<Pick<ToastService, 'show'>>;
  let router: jasmine.SpyObj<Router>;

  const el = () => fixture.nativeElement as HTMLElement;
  const fill = async (id: string, value: string) => {
    const input = el().querySelector<HTMLInputElement>(`#${id}`)!;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    fixture.detectChanges();
  };
  const submitButton = () => el().querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const submit = async () => {
    el().querySelector('form')!.dispatchEvent(new Event('submit'));
    await fixture.whenStable();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    login = jasmine.createSpyObj('LoginService', ['reauthenticate', 'logout']);
    login.reauthenticate.and.resolveTo();
    login.logout.and.resolveTo();
    users = jasmine.createSpyObj('UserService', ['deleteMe']);
    users.deleteMe.and.returnValue(of(undefined));
    toast = jasmine.createSpyObj('ToastService', ['show']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    router.navigate.and.resolveTo(true);
    await TestBed.configureTestingModule({
      imports: [DeleteAccount],
      providers: [
        provideZonelessChangeDetection(),
        { provide: LoginService, useValue: login },
        { provide: UserService, useValue: users },
        { provide: ToastService, useValue: toast },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(DeleteAccount);
    fixture.detectChanges();
  });

  it('lista o que será apagado', () => {
    expect(el().textContent).toContain('Plano Perfeito');
    expect(el().textContent).toContain('seu acesso');
  });

  it('o botão só habilita com a senha e EXCLUIR digitado', async () => {
    expect(submitButton().disabled).toBeTrue();
    await fill('delete-password', 'segredo');
    expect(submitButton().disabled).toBeTrue();
    await fill('delete-confirm', 'excluir');
    expect(submitButton().disabled).toBeTrue();
    await fill('delete-confirm', 'EXCLUIR');
    expect(submitButton().disabled).toBeFalse();
  });

  it('reautentica, exclui, encerra a sessão e volta para a entrada com o aviso', async () => {
    await fill('delete-password', 'segredo');
    await fill('delete-confirm', 'EXCLUIR');
    await submit();

    expect(login.reauthenticate).toHaveBeenCalledWith('segredo');
    expect(users.deleteMe).toHaveBeenCalled();
    expect(login.logout).toHaveBeenCalled();
    expect(toast.show.calls.mostRecent().args[0]).toContain('Sua conta foi excluída');
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('senha errada: não chama a API', async () => {
    login.reauthenticate.and.rejectWith(
      Object.assign(new Error('x'), { code: 'auth/invalid-credential' }),
    );
    await fill('delete-password', 'errada');
    await fill('delete-confirm', 'EXCLUIR');
    await submit();

    expect(users.deleteMe).not.toHaveBeenCalled();
    expect(el().querySelector('[role="alert"]')?.textContent).toContain('Senha atual incorreta.');
  });

  it('falha na API: mostra o erro e mantém a sessão', async () => {
    users.deleteMe.and.returnValue(
      throwError(() => new HttpErrorResponse({ status: 503, statusText: 'Indisponível' })),
    );
    await fill('delete-password', 'segredo');
    await fill('delete-confirm', 'EXCLUIR');
    await submit();

    expect(login.logout).not.toHaveBeenCalled();
    expect(el().querySelector('[role="alert"]')).not.toBeNull();
  });
});
