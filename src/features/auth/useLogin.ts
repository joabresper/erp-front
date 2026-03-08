import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loginWithEmailAndPassword } from './api';
import { AxiosError } from 'axios';
import type { AuthResponse } from './types';

interface UseLoginOptions {
  onSuccess?: (data: AuthResponse) => void;
  onError?: (error: AxiosError) => void;
}

export const useLogin = ({ onSuccess, onError }: UseLoginOptions = {}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: loginWithEmailAndPassword,
    onSuccess: (data) => {
      // Guardar token en LocalStorage
      localStorage.setItem('accessToken', data.accessToken);
      
      // Borrar cache del perfil
      queryClient.resetQueries({ queryKey: ['myProfile'] });

      // Ejecutar callback extra si existe (ej: redireccionar)
      if (onSuccess) onSuccess(data);
    },
    onError: (error: AxiosError) => {
      if (onError) onError(error);
    },
  });
};