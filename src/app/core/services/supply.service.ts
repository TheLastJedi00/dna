import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Supply } from '../models/supply.model';

@Injectable({
  providedIn: 'root',
})
export class SupplyService {
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/supply`;

  isSupplyForThisUser(userId: string, pillar: string) {
    return this.http.get<boolean>(`${this.api}/check/${userId}/${pillar}`);
  }

  getHumanDesignModule(userId: string, module: string): Observable<Supply> {
    return this.http.get<Supply>(`${this.api}/human-design/${module}/${userId}`);
  }

  getNumerologyModule(userId: string, module: string): Observable<Supply> {
    return this.http.get<Supply>(`${this.api}/numerology/${module}/${userId}`);
  }

  getAstrologyModule(userId: string, module: string): Observable<Supply> {
    return this.http.get<Supply>(`${this.api}/astrology/${module}/${userId}`);
  }

  getPerfectPlain(userId: string): Observable<Supply> {
    return this.http.get<Supply>(`${this.api}/perfect-plain/${userId}`);
  }

  createModule(userId: string, pillar: string, module: string) {
    // Backend: POST /supply/:pillar/:module/:userId
    return this.http.post<any>(`${this.api}/${pillar}/${module}/${userId}`, module);
  }

  createFullPillar(pillar: string, userId: string) {
    return this.http.post<any>(`${this.api}/${pillar}/${userId}`, null);
  }
}
