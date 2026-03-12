import { Badge } from '@mantine/core';
import { ROLE_COLORS, type RoleName } from '../../constants/roles';

interface Props {
  roleName: string; 
}

export const RoleBadge = ({ roleName }: Props) => {
  // Se trata este string como si fuera un RoleName
  // Si coincide con los de sistema (ADMIN, GERENTE), usa el color asignado.
  // Si es un rol nuevo creado por el usuario (ej: SUPERVISOR), cae en el fallback 'gray'.
  const color = ROLE_COLORS[roleName as RoleName] || 'gray';

  return (
    <Badge color={color} variant="light">
      {roleName}
    </Badge>
  );
};