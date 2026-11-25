import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { InviteService } from './invite.service';
import { LoginService } from './login.service';
import { ToastService } from './toast.service';

describe('InviteService', () => {
  let service: InviteService;
  let login: jasmine.SpyObj<Pick<LoginService, 'sendPasswordReset'>>;
  let toast: jasmine.SpyObj<Pick<ToastService, 'show'>>;

  beforeEach(() => {
    login = jasmine.createSpyObj('LoginService', ['sendPasswordReset']);
    toast = jasmine.createSpyObj('ToastService', ['show']);
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        { provide: LoginService, useValue: login },
        { provide: ToastService, useValue: toast },
      ],
    });
    service = TestBed.inject(InviteService);
  });

  it('logo após o cadastro: envia "Defina sua senha" e confirma', async () => {
    login.sendPasswordReset.and.resolveTo();
    await expectAsync(service.send('ana@dna.com', { justCreated: true })).toBeResolvedTo(true);
    expect(login.sendPasswordReset).toHaveBeenCalledWith('ana@dna.com');
    expect(toast.show).toHaveBeenCalledWith('Cadastro feito. Convite enviado para ana@dna.com.');
  });

  it('reenvio: mensagem própria', async () => {
    login.sendPasswordReset.and.resolveTo();
    await service.send('ana@dna.com');
    expect(toast.show).toHaveBeenCalledWith('Convite reenviado para ana@dna.com.');
  });

  it('falha no envio após o cadastro: avisa que o cadastro existe e como reenviar', async () => {
    login.sendPasswordReset.and.rejectWith(new Error('rede'));
    await expectAsync(service.send('ana@dna.com', { justCreated: true })).toBeResolvedTo(false);
    expect(toast.show.calls.mostRecent().args[0]).toContain('Reenviar convite');
  });
});
