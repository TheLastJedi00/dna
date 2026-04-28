export type Role = 'GERENTE'|'MAESTRA'|'ANALISTA'

export interface UserData {
    fullName: string;
    birthDate: string;
    birthTime: string;
    birthPlace: string;
    role?: Role
}