import { UserRole } from '../../types/types';

export interface UserData {
  id?: string;
  fullName: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  isActive?: boolean;
  roles?: UserRole[];
  /** Id de quem cadastrou a Maestra (Analista ou Manager). */
  createdBy?: string;
  /** Nome do criador, resolvido pelo backend — o "Analista Responsável". */
  createdByName?: string | null;
  login?: {
    password?: string;
    email?: string;
  };
}

/** Filtro de situação usado na listagem de Maestras. */
export type UserStatusFilter = 'active' | 'inactive' | 'all';

/** Resultado paginado: itens no corpo + metadados lidos dos headers X-*. */
export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
