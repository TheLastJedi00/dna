import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { AnalystService } from './analyst.service';
import { environment } from '../../../environments/environment';

describe('AnalystService', () => {
  let service: AnalystService;
  let http: HttpTestingController;
  const api = `${environment.apiUrl}/analysts`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        AnalystService,
      ],
    });
    service = TestBed.inject(AnalystService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('listAnalysts monta a rota e os query params', () => {
    service
      .listAnalysts({ page: 2, pageSize: 9, name: 'ana', status: 'inactive' })
      .subscribe();
    const req = http.expectOne((r) => r.url === api);
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.get('pageSize')).toBe('9');
    expect(req.request.params.get('name')).toBe('ana');
    expect(req.request.params.get('status')).toBe('inactive');
    req.flush([]);
  });

  it('listAnalysts lê os metadados dos headers X-*', () => {
    let result: { total: number; page: number; totalPages: number } | undefined;
    service.listAnalysts({ page: 1 }).subscribe((r) => (result = r));
    const req = http.expectOne((r) => r.url === api);
    req.flush([{ id: 'a1', fullName: 'Ana' }], {
      headers: {
        'X-Total-Count': '12',
        'X-Page': '1',
        'X-Page-Size': '9',
        'X-Total-Pages': '2',
      },
    });
    expect(result?.total).toBe(12);
    expect(result?.page).toBe(1);
    expect(result?.totalPages).toBe(2);
  });

  it('createAnalyst chama POST /analysts com nome e credenciais', () => {
    const payload = {
      fullName: 'Ana',
      login: { email: 'ana@dna.com', password: '123' },
    };
    service.createAnalyst(payload).subscribe();
    const req = http.expectOne(api);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush({});
  });

  it('updateAnalyst chama PATCH /analysts/:id', () => {
    service.updateAnalyst('a1', { fullName: 'Nova' }).subscribe();
    const req = http.expectOne(`${api}/a1`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ fullName: 'Nova' });
    req.flush({});
  });

  it('disableAnalyst chama DELETE /analysts/:id', () => {
    service.disableAnalyst('a1').subscribe();
    const req = http.expectOne(`${api}/a1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('reactivateAnalyst chama PATCH /analysts/:id/reactivate', () => {
    service.reactivateAnalyst('a1').subscribe();
    const req = http.expectOne(`${api}/a1/reactivate`);
    expect(req.request.method).toBe('PATCH');
    req.flush({});
  });

  it('findLinkedMaestras chama GET /analysts/:id/maestras', () => {
    let result: unknown;
    service.findLinkedMaestras('a1').subscribe((r) => (result = r));
    const req = http.expectOne(`${api}/a1/maestras`);
    expect(req.request.method).toBe('GET');
    req.flush([{ fullName: 'Maria', isActive: true }]);
    expect(result).toEqual([{ fullName: 'Maria', isActive: true }]);
  });
});
