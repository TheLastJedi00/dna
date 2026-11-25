import { UserRole } from '../../types/types';
import { AccessStatus } from './userdata.model';

/**
 * Analista: perfil sem mapa natal (não tem birthDate/birthTime/birthPlace) que
 * cadastra e acompanha os próprios usuários. Na criação vai só o `email` (convite).
 */
export interface AnalystData {
  id?: string;
  fullName: string;
  email?: string | null;
  isActive?: boolean;
  roles?: UserRole[];
  /** Status do acesso. Só vem no detalhe; `null` se não há conta de acesso. */
  accessStatus?: AccessStatus | null;
}

/**
 * Usuário vinculado como o Manager o vê na supervisão: apenas nome e status.
 * O backend omite de propósito o id e os dados pessoais — o Manager supervisiona
 * a carteira do Analista, mas não acessa os dados das clientes dele.
 */
export interface LinkedUser {
  fullName: string;
  isActive: boolean;
}
