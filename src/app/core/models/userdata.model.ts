import { UserRole } from '../../types/types';

export interface UserData {
  id?: string;
  fullName: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  roles?: UserRole[];
  login?: {
    password?: string;
    email?: string;
  };
}
