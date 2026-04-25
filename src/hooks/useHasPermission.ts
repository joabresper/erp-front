// En src/hooks/useHasPermission.ts
import { useProfile } from '../features/auth/useProfile';

export const useHasPermission = (requiredPermission: string): boolean => {
  const { data: currentUser } = useProfile();
  
  // Si es el ADMIN supremo (nivel 100), siempre le decimos que sí para no volvernos locos
  if (currentUser?.role?.name === 'ADMIN') return true;

  // Buscamos si dentro de sus permisos está el que pedimos
  const hasPerm = currentUser?.role?.permissions?.some(
    (perm) => perm.name === requiredPermission
  );

  return !!hasPerm;
};