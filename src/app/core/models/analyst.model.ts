import { UserRole } from '../../types/types';

/**
 * Analista: perfil sem mapa natal (não tem birthDate/birthTime/birthPlace) que
 * cadastra e acompanha as próprias Maestras. `login` só é enviado na criação.
 */
export interface AnalystData {
  id?: string;
  fullName: string;
  email?: string | null;
  isActive?: boolean;
  roles?: UserRole[];
  /** true enquanto a senha do Analista for provisória. Só vem no detalhe. */
  mustChangePassword?: boolean;
  /**
   * Senha provisória em texto plano, para o gestor repassar. Só vem no detalhe,
   * e some (`null`) assim que o Analista define a senha dele.
   */
  tempPassword?: string | null;
  /** Até quando a senha provisória vale (ISO 8601). Vence em 72h. */
  tempPasswordExpiresAt?: string | null;
  login?: {
    email?: string;
    password?: string;
  };
}

/**
 * Maestra vinculada como o Manager a vê na supervisão: apenas nome e status.
 * O backend omite de propósito o id e os dados pessoais — o Manager supervisiona
 * a carteira do Analista, mas não acessa os dados das clientes dele.
 */
export interface LinkedMaestra {
  fullName: string;
  isActive: boolean;
}
