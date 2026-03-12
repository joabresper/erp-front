export interface Role {
	id: string;
	name: string;
	description: string;
	level: number;
}

export interface RoleWithPermissions extends Role {
	permissions: Permission[];
}

export interface CreateRoleDTO {
	name: string;
	description: string;
	level: number;
}

export interface UpdateRoleDTO extends Partial<CreateRoleDTO> {}

export interface Permission {
	id: string;
	name: string;
	description: string;
}

export interface UpdateRolePermissionsDTO {
	permissionIds: string[];
}

