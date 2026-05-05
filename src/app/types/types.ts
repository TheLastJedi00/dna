export type UserRole = 'MANAGER' | 'ADMIN' | 'USER';
export interface DecodedToken {
  id: string;
  email: string;
  roles: UserRole[];
  name?: string;
}