import { NavLink } from '@mantine/core';
import { IconHome, IconUsers } from '@tabler/icons-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useProfile } from '../../features/auth/useProfile';

// Reglas de tu negocio
const MENU_ITEMS = [
  { 
    label: 'Inicio', 
    path: '/dashboard', 
    icon: IconHome, 
    minLevel: 0
  },
  { 
    label: 'Gestión de Usuarios', 
    path: '/users', 
    icon: IconUsers, 
    minLevel: 50
  },
];

export const AppSidebar = ({ toggleMobile }: { toggleMobile?: () => void }) => {
  const { data: user } = useProfile();
  const location = useLocation();
  const navigate = useNavigate();
  
  const userLevel = Number(user?.role?.level || 0);

  return (
    <>
      {MENU_ITEMS
        .filter(item => userLevel >= item.minLevel)

        .map((item) => (
          <NavLink
            key={item.path}
            label={item.label}
            leftSection={<item.icon size={20} stroke={1.5} />}
            // Mantine resalta automáticamente la opción si coincide con la URL actual
            active={location.pathname === item.path}
            onClick={() => {
              navigate(item.path);
              // Si estamos en celular, cerramos el menú al hacer clic
              if (toggleMobile) toggleMobile();
            }}
            // Estilos opcionales
            variant="filled"
            style={{ borderRadius: '8px', marginBottom: '4px' }}
          />
        ))}
    </>
  );
};