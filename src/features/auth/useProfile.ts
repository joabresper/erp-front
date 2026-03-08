import { useQuery } from '@tanstack/react-query';
import { getProfile } from './api';

export const useProfile = () => {
  const accessToken = localStorage.getItem('accessToken');

  return useQuery({
    queryKey: ['getProfile'],
    queryFn: async () => {
      const data = await getProfile();
      return data;
    },
    // SOLO ejecuta la consulta si hay un token guardado
    enabled: !!accessToken, 
    // Evita que recargue el perfil cada vez que el usuario cambia de pestaña
    staleTime: 1000 * 60 * 60, 
    retry: false, // Si falla (ej. token expirado), no reintenta, falla rápido
  });
};