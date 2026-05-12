import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { DnaStatus } from '../models/dna-status.model';

@Injectable({
  providedIn: 'root',
})
export class DnaStatusService {
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/dna-status`;

  getStatusByUserId(userId: string): Observable<DnaStatus> {
    return this.http.get<DnaStatus>(`${this.api}/${userId}`);
  }
}
