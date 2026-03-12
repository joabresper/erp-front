import api from "../../api/axios";
import type { Role } from "../../types/models";
import type { CreateRoleDTO, Permission, RoleWithPermissions, UpdateRoleDTO, UpdateRolePermissionsDTO } from "./types";

export const getRoles = async (includePermissions: boolean = false): Promise<Role[]> => {
  const { data } = await api.get('/roles', {
    params: { includePermissions }
  });
  return data;
};

const indludePermsInGetRoleById = true;
export const getRoleById = async (id: string): Promise<RoleWithPermissions> => {
  const { data } = await api.get(`/roles/${id}?includePermissions=${indludePermsInGetRoleById}`);
  return data;
};

export const createRole = async (userData: CreateRoleDTO): Promise<Role> => {
  const { data } = await api.post('/roles', userData);
  return data;
};

export const updateRole = async (id: string, userData: UpdateRoleDTO): Promise<Role> => {
  const { data } = await api.patch(`/roles/${id}`, userData);
  return data;
};

export const deleteRole = async (id: string): Promise<void> => {
  await api.delete(`/roles/${id}`);
};

export const getPermissions = async (): Promise<Permission[]> => {
  const { data } = await api.get('/permissions');
  return data;
}

export const updateRolePermissions = async (roleId: string, permissionIds: UpdateRolePermissionsDTO): Promise<Role> => {
  const { data } = await api.patch(`/roles/${roleId}/permissions`, permissionIds);
  return data;
}