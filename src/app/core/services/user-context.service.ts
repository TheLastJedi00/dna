import { inject, Injectable } from '@angular/core';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root',
})
export class UserContextService {
  private readonly loginService = inject(LoginService);
  private _targetUserId: string | null = null;

  setTargetUser(userId: string) {
    this._targetUserId = userId;
  }

  clearTargetUser() {
    this._targetUserId = null;
  }

  get userId(): string {
    const decoded = this.loginService.getDecodedToken();
    return decoded?.id ?? '';
  }
}
