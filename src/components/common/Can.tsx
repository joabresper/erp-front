import { type ReactNode } from 'react';
import { useHasPermission } from '../../hooks/useHasPermission';

interface Props {
  permission?: string;
  children: ReactNode;
}

export const Can = ({ permission, children }: Props) => {
  const isAllowed = useHasPermission(permission || '');

  if (!permission) return <>{children}</>; // Si no se especifica permiso, mostramos el contenido sin restricciones

  // Si tiene permiso, dibuja los botones/hijos. Si no, no dibuja nada.
  return isAllowed ? <>{children}</> : null;
};