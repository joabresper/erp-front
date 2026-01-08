import type { AuthResponse, LoginCredentials } from './types';
import api from '../../api/axios';

export const loginWithEmailAndPassword = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/login', credentials);
  return data;
};