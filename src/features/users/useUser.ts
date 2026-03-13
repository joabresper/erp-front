import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { notifications } from '@mantine/notifications'; // Opcional: para feedback
import { changeUserRole, createUser, deleteUser, getUsers, updateUser } from './api';
import type { ChangeUserRolDTO, UpdateUserDTO } from './types';

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    staleTime: 1000 * 60 * 5, // Cache por 5 minutos
  });
};

export const useCreateUser = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      if(onSuccess) onSuccess();
    },
  });
};

interface UpdateUserVariables {
  id: string;
  data: UpdateUserDTO;
};

export const useUpdateUser = (onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: UpdateUserVariables) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      if(onSuccess) onSuccess();
    },
  });
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
};

interface ChangeUserRoleVariables {
  userId: string;
  newRoleId: ChangeUserRolDTO;
};
export const useChangeUserRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, newRoleId }: ChangeUserRoleVariables) => changeUserRole(userId, newRoleId ),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
};