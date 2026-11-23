import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { Router } from '@angular/router';
import { VerifyEmailModal, RESEND_COOLDOWN_SECONDS } from './verify-email-modal';
import { LoginService } from '../../../core/services/login.service';

describe('VerifyEmailModal', () => {
  let fixture: ComponentFixture<VerifyEmailModal>;
  let login: jasmine.SpyObj<
    Pick<LoginService, 'sendEmailVerification' | 'refreshEmailVerification' | 'logout'>
  > & { email: string };
  let router: jasmine.SpyObj<Router>;

  const el = () => fixture.nativeElement as HTMLElement;
  const button = (name: string) =>
    el().querySelector<HTMLButtonElement>(`[data-test="${name}"]`)!;
  const click = async (name: string) => {
    button(name).click();
    await fixture.whenStable();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    login = Object.assign(
      jasmine.createSpyObj('LoginService', [
        'sendEmailVerification',
        'refreshEmailVerification',
        'logout',
      ]),
      { email: 'ana@dna.com' },
    );
    login.sendEmailVerification.and.resolveTo();
    login.logout.and.resolveTo();
    router = jasmine.createSpyObj('Router', ['navigate']);
    router.navigate.and.resolveTo(true);
    await TestBed.configureTestingModule({
      imports: [VerifyEmailModal],
      providers: [
        provideZonelessChangeDetection(),
        { provide: LoginService, useValue: login },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(VerifyEmailModal);
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  it('é um alertdialog modal, mostra o e-mail e não tem botão de fechar', () => {
    const dialog = el().querySelector('[role="alertdialog"]')!;
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(el().textContent).toContain('ana@dna.com');
    expect(el().querySelector('[aria-label="Fechar"]')).toBeNull();
  });

  it('enviar: manda o e-mail e trava o reenvio por 60s', async () => {
    await click('send');

    expect(login.sendEmailVerification).toHaveBeenCalled();
    expect(el().querySelector('[role="status"]')?.textContent).toContain('Link enviado');
    expect(button('send').disabled).toBeTrue();
    expect(button('send').textContent).toContain(`Reenviar em ${RESEND_COOLDOWN_SECONDS}s`);
  });

  it('"Já confirmei" sem confirmação: avisa e continua aberto', async () => {
    login.refreshEmailVerification.and.resolveTo(false);
    await click('check');
    expect(el().querySelector('[role="alert"]')?.textContent).toContain(
      'Ainda não encontramos a confirmação',
    );
  });

  it('muitas tentativas no envio: mostra o erro do Firebase', async () => {
    login.sendEmailVerification.and.rejectWith(
      Object.assign(new Error('x'), { code: 'auth/too-many-requests' }),
    );
    await click('send');
    expect(el().querySelector('[role="alert"]')?.textContent).toContain('Muitas tentativas');
  });

  it('"Corrigir e-mail" leva ao Meu Perfil; "Sair" encerra a sessão', async () => {
    await click('fix-email');
    expect(router.navigate).toHaveBeenCalledWith(['/profile']);

    await click('logout');
    expect(login.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
