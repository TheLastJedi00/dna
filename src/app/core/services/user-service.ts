import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { UserData } from '../models/userdata.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient)
  private readonly api = `${environment.apiUrl}/users`

  getUserById(userId: string): Observable<UserData> {
    return this.http.get<UserData>(`${this.api}/me/${userId}`);
  }
}
