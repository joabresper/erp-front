import type { AuthResponse, LoginCredentials } from './types';
import api from '../../api/axios';
import type { User } from '../../types/models';

export const loginWithEmailAndPassword = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/login', credentials);
  return data;
};

export const getProfile = async (): Promise<User> => {
  const { data } = await api.get<User>('/profile');
  return data;
}