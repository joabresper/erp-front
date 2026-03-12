// En src/hooks/useHasPermission.ts
import { useProfile } from '../features/auth/useProfile';
import { useRole } from '../features/roles/useRoles';

export const useHasPermission = (requiredPermission: string): boolean => {
  const { data: currentUser } = useProfile();
  
  // Si es el ADMIN supremo (nivel 100), siempre le decimos que sí para no volvernos locos
  if (currentUser?.role?.name === 'ADMIN') return true;

  // Buscamos los permisos del rol del usuario
  const userPermissions = useRole(currentUser?.role.id || '')?.data?.permissions || [];

  // Buscamos si dentro de sus permisos está el que pedimos
  const hasPerm = userPermissions.some(
    (perm) => perm.name === requiredPermission
  );

  return !!hasPerm;
};