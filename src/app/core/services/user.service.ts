import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { map, Observable } from 'rxjs';
import {
  PagedResult,
  UserData,
  UserStatusFilter,
} from '../models/userdata.model';

export interface ListUsersParams {
  orderBy?: string;
  direction?: string;
  page?: number;
  pageSize?: number;
  name?: string;
  status?: UserStatusFilter;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/users`;

  findMe(userId: string): Observable<UserData> {
    return this.http.get<UserData>(`${this.api}/me/${userId}`);
  }

  findUserById(userId: string): Observable<UserData> {
    return this.http.get<UserData>(`${this.api}/${userId}`);
  }

  /**
   * Lista Maestras com paginação, busca por nome e filtro de status. O corpo é
   * o array da página; os metadados vêm nos headers X-* (expostos no CORS) e
   * são montados no PagedResult.
   */
  listUsers(params: ListUsersParams = {}): Observable<PagedResult<UserData>> {
    const orderBy = params.orderBy ?? 'fullName';
    const direction = params.direction ?? 'asc';

    let httpParams = new HttpParams();
    if (params.page) httpParams = httpParams.set('page', params.page);
    if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize);
    if (params.name) httpParams = httpParams.set('name', params.name);
    if (params.status) httpParams = httpParams.set('status', params.status);

    return this.http
      .get<UserData[]>(`${this.api}/active/${orderBy}/${direction}`, {
        params: httpParams,
        observe: 'response',
      })
      .pipe(
        map((res) => {
          const items = res.body ?? [];
          const header = (name: string) => res.headers.get(name);
          return {
            items,
            total: Number(header('X-Total-Count') ?? items.length),
            page: Number(header('X-Page') ?? params.page ?? 1),
            pageSize: Number(header('X-Page-Size') ?? params.pageSize ?? items.length),
            totalPages: Number(header('X-Total-Pages') ?? 1),
          } satisfies PagedResult<UserData>;
        }),
      );
  }

  /** Cadastro por convite (spec 010): `POST /users` devolve o id criado. */
  createMaestra(user: UserData) {
    return this.http.post<{ id: string }>(this.api, user);
  }

  updateUser(userId: string, data: Partial<UserData>) {
    return this.http.patch<UserData>(`${this.api}/${userId}`, data);
  }

  reactivateUser(userId: string) {
    return this.http.patch<UserData>(`${this.api}/${userId}/reactivate`, {});
  }

  deleteUser(userId: string) {
    return this.http.delete<UserData>(`${this.api}/${userId}`);
  }

  /** Gera a senha provisória da Maestra (recuperação de acesso pelo painel). */
  setTempPassword(userId: string, password: string) {
    return this.http.patch<void>(`${this.api}/${userId}/temp-password`, {
      password,
    });
  }
}
