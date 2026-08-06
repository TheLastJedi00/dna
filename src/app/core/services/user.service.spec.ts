import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { UserService } from './user.service';
import { environment } from '../../../environments/environment';

describe('UserService', () => {
  let service: UserService;
  let http: HttpTestingController;
  const api = `${environment.apiUrl}/users`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        UserService,
      ],
    });
    service = TestBed.inject(UserService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('listUsers monta a rota e os query params', () => {
    service
      .listUsers({ page: 2, pageSize: 9, name: 'ana', status: 'inactive' })
      .subscribe();
    const req = http.expectOne(
      (r) => r.url === `${api}/active/fullName/asc`,
    );
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('page')).toBe('2');
    expect(req.request.params.get('pageSize')).toBe('9');
    expect(req.request.params.get('name')).toBe('ana');
    expect(req.request.params.get('status')).toBe('inactive');
    req.flush([]);
  });

  it('listUsers lê os metadados dos headers X-*', () => {
    let result: { total: number; page: number; totalPages: number } | undefined;
    service.listUsers({ page: 1 }).subscribe((r) => (result = r));
    const req = http.expectOne(`${api}/active/fullName/asc?page=1`);
    req.flush([{ id: '1', fullName: 'Ana' }], {
      headers: {
        'X-Total-Count': '5',
        'X-Page': '1',
        'X-Page-Size': '9',
        'X-Total-Pages': '1',
      },
    });
    expect(result?.total).toBe(5);
    expect(result?.page).toBe(1);
    expect(result?.totalPages).toBe(1);
  });

  it('reactivateUser chama PATCH /users/:id/reactivate', () => {
    service.reactivateUser('u1').subscribe();
    const req = http.expectOne(`${api}/u1/reactivate`);
    expect(req.request.method).toBe('PATCH');
    req.flush({});
  });

  it('updateUser chama PATCH /users/:id', () => {
    service.updateUser('u1', { fullName: 'Nova' }).subscribe();
    const req = http.expectOne(`${api}/u1`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ fullName: 'Nova' });
    req.flush({});
  });

  it('setTempPassword chama PATCH /users/:id/temp-password', () => {
    service.setTempPassword('u1', 'nova123').subscribe();
    const req = http.expectOne(`${api}/u1/temp-password`);
    expect(req.request.method).toBe('PATCH');
    expect(req.request.body).toEqual({ password: 'nova123' });
    req.flush(null);
  });

  it('deleteUser chama DELETE /users/:id', () => {
    service.deleteUser('u1').subscribe();
    const req = http.expectOne(`${api}/u1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
