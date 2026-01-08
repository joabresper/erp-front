import { useMutation } from '@tanstack/react-query';
import { loginWithEmailAndPassword } from './api';
import { AxiosError } from 'axios';
import type { AuthResponse } from './types';

interface UseLoginOptions {
  onSuccess?: (data: AuthResponse) => void;
  onError?: (error: AxiosError) => void;
}

export const useLogin = ({ onSuccess, onError }: UseLoginOptions = {}) => {
  return useMutation({
    mutationFn: loginWithEmailAndPassword,
    onSuccess: (data) => {
      // 1. Guardar token en LocalStorage (o Cookies)
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // 2. Ejecutar callback extra si existe (ej: redireccionar)
      if (onSuccess) onSuccess(data);
    },
    onError: (error: AxiosError) => {
      if (onError) onError(error);
    },
  });
};