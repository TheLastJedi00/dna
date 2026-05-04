export type Role = 'MANAGER'|'ADMIN'|'USER'

export interface UserData {
    fullName: string;
    birthDate: string;
    birthTime: string;
    birthPlace: string;
    role?: Role
}