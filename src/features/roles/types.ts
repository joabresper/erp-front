export interface CreateRoleDTO {
	name: string;
	description: string;
	level: number;
}

export interface UpdateRoleDTO extends Partial<CreateRoleDTO> {}

export interface UpdateRolePermissionsDTO {
	permissionIds: string[];
}

