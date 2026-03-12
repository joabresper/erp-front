import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createRole, deleteRole, getRoleById, getRoles, updateRole, updateRolePermissions } from './api';
import type { UpdateRoleDTO } from './types';

export const useRoles = () => {
  return useQuery({
    queryKey: ['roles'],
    queryFn: () => getRoles(true),
    staleTime: 1000 * 60 * 60, // Los roles casi nunca cambian, cache por 1 hora
  });
};

export const useRole = (id: string) => {
  return useQuery({
    queryKey: ['roles', id],
    queryFn: () => getRoleById(id),
    staleTime: 1000 * 60 * 60, // Cache por 1 hora
  });
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
    onError: (error) => {
      console.error('Error creating role:', error);
    }
  });
};

interface UpdateRoleVariables {
  id: string;
  data: UpdateRoleDTO;
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateRoleVariables) => updateRole(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
    onError: (error) => {
      console.error('Error updating role:', error);
    }
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
    onError: (error) => {
      console.error('Error deleting role:', error);
    },
  });
};

export const useUpdateRolePermissions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roleId, permissionIds }: { roleId: string; permissionIds: string[] }) =>
      updateRolePermissions(roleId, { permissionIds }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
    onError: (error) => {
      console.error('Error updating role permissions:', error);
    },
  });
};