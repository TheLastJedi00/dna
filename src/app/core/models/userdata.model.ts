import { UserRole } from '../../types/types';
import { Pronoun } from '../utils/pronoun';

export interface UserData {
  id?: string;
  fullName: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  /** Ramo/segmento em que a empresa atua. Texto livre. */
  businessArea?: string;
  /** Ausente nos cadastros anteriores à spec 007 — assume-se `'feminino'`. */
  pronoun?: Pronoun;
  isActive?: boolean;
  roles?: UserRole[];
  /** Id de quem cadastrou a Maestra (Analista ou Manager). */
  createdBy?: string;
  /** Nome do criador, resolvido pelo backend — o "Analista Responsável". */
  createdByName?: string | null;
  /** E-mail de acesso. Só vem no **detalhe** (`GET /users/:id`). */
  email?: string | null;
  /** true enquanto a senha da Maestra for provisória. Só vem no detalhe. */
  mustChangePassword?: boolean;
  /**
   * Senha provisória em texto plano, para o gestor repassar. Só vem no detalhe,
   * e some (`null`) assim que a Maestra define a senha dela.
   */
  tempPassword?: string | null;
  /** Até quando a senha provisória vale (ISO 8601). Vence em 72h. */
  tempPasswordExpiresAt?: string | null;
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
