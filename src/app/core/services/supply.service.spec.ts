import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { SupplyService } from './supply.service';
import { environment } from '../../../environments/environment';

describe('SupplyService', () => {
  let service: SupplyService;
  let http: HttpTestingController;
  const api = `${environment.apiUrl}/supply`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        SupplyService,
      ],
    });
    service = TestBed.inject(SupplyService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('getPerfectPlain chama GET /supply/perfect-plain/:userId', () => {
    service.getPerfectPlain('u1').subscribe();
    const req = http.expectOne(`${api}/perfect-plain/u1`);
    expect(req.request.method).toBe('GET');
    req.flush({ id: 'x', pillar: 'perfect-plain', module: 'plano-perfeito', userId: 'u1', topics: [] });
  });

  it('createFullPillar chama POST /supply/:pillar/:userId', () => {
    service.createFullPillar('perfect-plain', 'u1').subscribe();
    const req = http.expectOne(`${api}/perfect-plain/u1`);
    expect(req.request.method).toBe('POST');
    req.flush([]);
  });

  it('createModule usa a ordem :pillar/:module/:userId (casa com o backend)', () => {
    service.createModule('u1', 'human-design', 'perfil').subscribe();
    const req = http.expectOne(`${api}/human-design/perfil/u1`);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });
});
