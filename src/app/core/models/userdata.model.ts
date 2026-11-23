import { UserRole } from '../../types/types';
import { Pronoun } from '../utils/pronoun';

/**
 * Situação do acesso (spec 010), vinda do Firebase: nunca entrou (convite),
 * entrou sem confirmar o e-mail, ou e-mail confirmado.
 */
export type AccessStatus = 'invite_pending' | 'email_unverified' | 'active';

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
  /** Id de quem cadastrou o usuário (Analista ou Manager). */
  createdBy?: string;
  /** Nome do criador, resolvido pelo backend — o "Analista Responsável". */
  createdByName?: string | null;
  /** E-mail de acesso. Só vem no **detalhe** (`GET /users/:id`). */
  email?: string | null;
  /** Status do acesso. Só vem no detalhe; `null` se não há conta de acesso. */
  accessStatus?: AccessStatus | null;
}

/** Filtro de situação usado na listagem de usuários. */
export type UserStatusFilter = 'active' | 'inactive' | 'all';

/** Resultado paginado: itens no corpo + metadados lidos dos headers X-*. */
export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
