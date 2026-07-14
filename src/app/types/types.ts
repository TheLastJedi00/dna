export type UserRole = 'MANAGER' | 'ADMIN' | 'ANALYST' | 'USER';
export interface DecodedToken {
  id: string;
  email: string;
  roles: UserRole[];
  name?: string;
  exp?: number;
  iat?: number;
}
