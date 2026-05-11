export type Role = 'MANAGER' | 'ADMIN' | 'USER';

export interface UserData {
  id?: string
  fullName: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  role?: Role;
  login?: {
    password?: string;
    email?: string;
    role?: Role;
  };
}
