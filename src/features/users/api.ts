import api from '../../api/axios';
import type { User, UserWithRole } from '../../types/models';
import type { ChangeUserRolDTO, CreateUserDTO, UpdateUserDTO } from './types';

export const getUsers = async (): Promise<UserWithRole[]> => {
  const { data } = await api.get('/users', {
    params: {
      includeRole: true,
    },
  });
  return data;
};

export const createUser = async (userData: CreateUserDTO): Promise<User> => {
  const { data } = await api.post('/users', userData);
  return data;
};

export const updateUser = async (id: string, userData: UpdateUserDTO): Promise<User> => {
  const { data } = await api.patch(`/users/${id}`, userData)
  return data;
}

export const deleteUser = async (id: string) => {
  const { data } = await api.delete(`/users/${id}`);
  return data;
};

export const changeUserRole = async (userId: string, newRoleId: ChangeUserRolDTO): Promise<UserWithRole> => {
  const { data } = await api.patch(`/users/${userId}/role`, newRoleId);
  return data;
}