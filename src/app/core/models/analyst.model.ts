import { UserRole } from '../../types/types';

/**
 * Analista: perfil sem mapa natal (não tem birthDate/birthTime/birthPlace) que
 * cadastra e acompanha as próprias Maestras. `login` só é enviado na criação.
 */
export interface AnalystData {
  id?: string;
  fullName: string;
  email?: string;
  isActive?: boolean;
  roles?: UserRole[];
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
