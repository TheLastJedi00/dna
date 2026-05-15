import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupplyService {
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/supply`;

  readonly validHumanDesignModules = [
    'tipo-aurico',
    'autoridade',
    'perfil',
    'centros-definidos',
    'centros-indefinidos',
    'centros-abertos',
    'canais',
    'portao-personalidade-sol',
    'portao-personalidade-terra',
    'portao-personalidade-lua',
    'portao-desenho-sol',
    'portao-desenho-terra',
    'portao-desenho-lua',
    'encarnacao',
  ];

  isSupplyForThisUser(userId: string, pillar: string) {
    return this.http.get<boolean>(`${this.api}/check/${userId}/${pillar}`);
  }

  createModule(userId: string, pillar: string, module: string) {
    return this.http.post<any>(`${this.api}/${userId}/${pillar}/${module}`, module);
  }

  createFullPillar(pillar: string, userId: string){
    return this.http.post<any>(`${this.api}/${pillar}/${userId}`, null)
  }
}
