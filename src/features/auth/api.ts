import type { AuthResponse, LoginCredentials } from './types';
import api from '../../api/axios';
import type { UserWithRole } from '../../types/models';

export const loginWithEmailAndPassword = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/login', credentials);
  return data;
};

export const getProfile = async (): Promise<UserWithRole> => {
  const { data } = await api.get<UserWithRole>('/profile');
  return data;
}