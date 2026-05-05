import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken, UserRole } from '../../types/types';

@Injectable({
  providedIn: 'root',
})
export class Login {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;
  private readonly apiLogin = this.baseUrl + '/auth';

  login(email: string, password: string): Observable<any> {
    return this.http.post(this.apiLogin, { email, password });
  }

  getDecodedToken(): DecodedToken | null {
    const token = localStorage.getItem('access_token');
    if (token) {
      return jwtDecode<DecodedToken>(token);
    }
    return null;
  }

  getUserRole(): UserRole[] | null {
    const decoded = this.getDecodedToken();
    return decoded?.roles ?? null;
  }
}
