import { useQuery } from '@tanstack/react-query';
import { getRoles } from './api';

export const useRoles = () => {
  return useQuery({
    queryKey: ['roles'],
    queryFn: getRoles,
    staleTime: 1000 * 60 * 60, // Los roles casi nunca cambian, cache por 1 hora
  });
};