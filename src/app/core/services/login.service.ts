import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken, UserRole } from '../../types/types';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;
  private readonly apiLogin = this.baseUrl + '/auth';

  login(email: string, password: string): Observable<any> {
    return this.http.post<{ access_token: string }>(this.apiLogin, { email, password }).pipe(
      tap((response) => {
        if (response?.access_token) {
          localStorage.setItem('access_token', response.access_token);
        }
      }),
    );
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
