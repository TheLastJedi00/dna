import { inject, Injectable } from '@angular/core';
import { LoginService } from './login.service';
import { ToastService } from './toast.service';

/**
 * Convite de acesso (spec 010): a conta nasce no Firebase sem senha e a pessoa
 * recebe o e-mail "Defina sua senha" — o link de redefinição do Firebase. É
 * disparado pelo front logo após o cadastro e pelo "Reenviar convite".
 */
@Injectable({ providedIn: 'root' })
export class InviteService {
  private readonly login = inject(LoginService);
  private readonly toast = inject(ToastService);

  /** Envia e avisa o resultado. Devolve `false` se o envio falhou. */
  async send(email: string, opts: { justCreated?: boolean } = {}): Promise<boolean> {
    try {
      await this.login.sendPasswordReset(email);
      this.toast.show(
        opts.justCreated
          ? `Cadastro feito. Convite enviado para ${email}.`
          : `Convite reenviado para ${email}.`,
      );
      return true;
    } catch {
      this.toast.show(
        opts.justCreated
          ? 'Cadastro feito, mas o convite não foi enviado. Use “Reenviar convite” no detalhe.'
          : 'Não foi possível reenviar o convite. Tente novamente.',
      );
      return false;
    }
  }
}
