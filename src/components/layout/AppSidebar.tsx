import { NavLink } from '@mantine/core';
import { IconBaguette, IconHome, IconUsers, IconUsersGroup, type TablerIcon } from '@tabler/icons-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useProfile } from '../../features/auth/useProfile';
import { APP_SECTIONS } from '../common/configuration/app-sections';

export interface MenuItem {
  label: string;
  path: string;
  minLevel: number;
  icon: TablerIcon;
}

const MENU_ITEMS: MenuItem[] = [
  { ...APP_SECTIONS.DASHBOARD, icon: IconHome },
  { ...APP_SECTIONS.USERS, icon: IconUsers },
  { ...APP_SECTIONS.ROLES, icon: IconUsersGroup },
  { ...APP_SECTIONS.PRODUCTS, icon: IconBaguette },
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