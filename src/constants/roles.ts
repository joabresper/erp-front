export const Roles = {
	ADMIN: 'ADMIN',
	GERENTE: 'GERENTE',
	USER: 'USER',
} as const;

export type RoleName = typeof Roles[keyof typeof Roles];