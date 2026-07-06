import { inject, Injectable } from '@angular/core';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root',
})
export class UserContextService {
  private readonly loginService = inject(LoginService);

  get userId(): string {
    return this.loginService.userId;
  }
}
