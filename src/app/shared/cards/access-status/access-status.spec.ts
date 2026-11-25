import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { AccessStatusCard } from './access-status';

describe('AccessStatusCard', () => {
  let fixture: ComponentFixture<AccessStatusCard>;
  const el = () => fixture.nativeElement as HTMLElement;
  const resendButton = () => el().querySelector<HTMLButtonElement>('button');

  const render = (status: string | null) => {
    fixture.componentRef.setInput('status', status);
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessStatusCard],
      providers: [provideZonelessChangeDetection()],
    }).compileComponents();
    fixture = TestBed.createComponent(AccessStatusCard);
  });

  it('convite pendente: selo e "Reenviar convite"', () => {
    render('invite_pending');
    expect(el().textContent).toContain('Convite pendente');
    expect(resendButton()?.textContent).toContain('Reenviar convite');
  });

  it('e-mail não confirmado: também permite reenviar', () => {
    render('email_unverified');
    expect(el().textContent).toContain('E-mail não confirmado');
    expect(resendButton()).not.toBeNull();
  });

  it('ativo: sem botão de reenvio', () => {
    render('active');
    expect(el().textContent).toContain('Acesso ativo');
    expect(resendButton()).toBeNull();
  });

  it('sem conta de acesso: avisa e não oferece reenvio', () => {
    render(null);
    expect(el().textContent).toContain('Sem acesso');
    expect(resendButton()).toBeNull();
  });

  it('emite resend no clique', () => {
    render('invite_pending');
    let emitted = false;
    fixture.componentInstance.resend.subscribe(() => (emitted = true));
    resendButton()!.click();
    expect(emitted).toBeTrue();
  });
});
