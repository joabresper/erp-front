import type { RoleName } from "../constants/roles";

export interface Role {
    id: string;
    name: RoleName;
    description?: string;
}

export interface User {
    id: string;
    email: string;
    fullName: string;
    phone?: string;
	address?: string;
    deletedAt: string; // ISO Date String
    roleId: string;
}

export interface UserWithRole extends Omit<User, 'roleId'> {
    role: Role;
}