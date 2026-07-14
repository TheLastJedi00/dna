import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AnalystData, LinkedMaestra } from '../models/analyst.model';
import { PagedResult, UserStatusFilter } from '../models/userdata.model';

export interface ListAnalystsParams {
  page?: number;
  pageSize?: number;
  name?: string;
  status?: UserStatusFilter;
}

/**
 * Acesso a /analysts (rotas exclusivas de ADMIN/MANAGER). Mesma convenção da
 * listagem de Maestras: itens no corpo, metadados de paginação nos headers X-*.
 */
@Injectable({
  providedIn: 'root',
})
export class AnalystService {
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/analysts`;

  listAnalysts(
    params: ListAnalystsParams = {},
  ): Observable<PagedResult<AnalystData>> {
    let httpParams = new HttpParams();
    if (params.page) httpParams = httpParams.set('page', params.page);
    if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize);
    if (params.name) httpParams = httpParams.set('name', params.name);
    if (params.status) httpParams = httpParams.set('status', params.status);

    return this.http
      .get<AnalystData[]>(this.api, { params: httpParams, observe: 'response' })
      .pipe(
        map((res) => {
          const items = res.body ?? [];
          const header = (name: string) => res.headers.get(name);
          return {
            items,
            total: Number(header('X-Total-Count') ?? items.length),
            page: Number(header('X-Page') ?? params.page ?? 1),
            pageSize: Number(
              header('X-Page-Size') ?? params.pageSize ?? items.length,
            ),
            totalPages: Number(header('X-Total-Pages') ?? 1),
          } satisfies PagedResult<AnalystData>;
        }),
      );
  }

  createAnalyst(analyst: AnalystData): Observable<AnalystData> {
    return this.http.post<AnalystData>(this.api, analyst);
  }

  updateAnalyst(
    analystId: string,
    data: Pick<AnalystData, 'fullName'>,
  ): Observable<AnalystData> {
    return this.http.patch<AnalystData>(`${this.api}/${analystId}`, data);
  }

  disableAnalyst(analystId: string): Observable<AnalystData> {
    return this.http.delete<AnalystData>(`${this.api}/${analystId}`);
  }

  reactivateAnalyst(analystId: string): Observable<AnalystData> {
    return this.http.patch<AnalystData>(
      `${this.api}/${analystId}/reactivate`,
      {},
    );
  }

  /** Detalhe do Analista: único lugar com e-mail e o estado da senha provisória. */
  findAnalystById(analystId: string): Observable<AnalystData> {
    return this.http.get<AnalystData>(`${this.api}/${analystId}`);
  }

  /** Gera a senha provisória do Analista (recuperação de acesso pelo painel). */
  setTempPassword(analystId: string, password: string): Observable<void> {
    return this.http.patch<void>(`${this.api}/${analystId}/temp-password`, {
      password,
    });
  }

  /** Supervisão: carteira do Analista (só nome + status, sem dados pessoais). */
  findLinkedMaestras(analystId: string): Observable<LinkedMaestra[]> {
    return this.http.get<LinkedMaestra[]>(`${this.api}/${analystId}/maestras`);
  }
}
