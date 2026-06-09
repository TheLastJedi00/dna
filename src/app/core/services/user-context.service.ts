import { inject, Injectable } from '@angular/core';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root',
})
export class UserContextService {
  private readonly loginService = inject(LoginService);

  /** ID do usuário logado, extraído do JWT */
  get userId(): string {
    const decoded = this.loginService.getDecodedToken();
    return decoded?.id ?? '';
  }
}
