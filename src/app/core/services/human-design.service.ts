import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HumanDesignData } from '../models/dhdata.model';

@Injectable({
  providedIn: 'root',
})
export class HumanDesignService {
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/human-design`;

  getByUserId(userId: string): Observable<HumanDesignData> {
    return this.http.get<HumanDesignData>(`${this.api}/user/${userId}`);
  }
}
