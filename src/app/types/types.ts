export type UserRole = 'MANAGER' | 'ADMIN' | 'ANALYST' | 'USER';
export interface DecodedToken {
  id: string;
  email: string;
  roles: UserRole[];
  /**
   * true enquanto a senha em uso for provisória. Vem no token (e não só na
   * resposta do login) para que o bloqueio da troca obrigatória sobreviva a um
   * reload ou a uma URL digitada à mão.
   */
  mustChangePassword?: boolean;
  name?: string;
  exp?: number;
  iat?: number;
}
