import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { LeituraAstrologica } from '../models/astrology.model';

@Injectable({
  providedIn: 'root',
})
export class AstrologyService {
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/astrology`;

  getByUserId(userId: string): Observable<LeituraAstrologica> {
    return this.http.get<LeituraAstrologica>(`${this.api}/user/${userId}`);
  }

  createAstrologyByUser(astrologyData: LeituraAstrologica): Observable<LeituraAstrologica> {
    return this.http.post<LeituraAstrologica>(`${this.api}`, astrologyData);
  }
}
