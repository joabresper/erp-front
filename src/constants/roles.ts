export const Roles = {
	ADMIN: 'ADMIN',
	GERENTE: 'GERENTE',
	USER: 'USER',
} as const;

export type RoleName = typeof Roles[keyof typeof Roles];

export const ROLE_COLORS: Record<RoleName, string> = {
	[Roles.ADMIN]: 'red',
	[Roles.GERENTE]: 'blue',
	[Roles.USER]: 'green',
};