import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { NumerologyData } from '../models/numdata.model';

@Injectable({
  providedIn: 'root',
})
export class NumerologyService {
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/numerology`;

  getByUserId(userId: string): Observable<NumerologyData> {
    return this.http.get<NumerologyData>(`${this.api}/user/${userId}`);
  }

  createNumerologyByUser(numerologyData: NumerologyData): Observable<NumerologyData> {
    return this.http.post<NumerologyData>(`${this.api}`, numerologyData);
  }
}
