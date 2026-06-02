import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { LeituraAstrologica } from '../models/astrology.model';
import { FakeApi } from './fake-api';

@Injectable({
  providedIn: 'root',
})
export class AstrologyService {
  private readonly fakeApi = inject(FakeApi);

  getByUserId(userId: string): Observable<LeituraAstrologica> {
    return of(this.fakeApi.getAstrologyData());
  }
}
