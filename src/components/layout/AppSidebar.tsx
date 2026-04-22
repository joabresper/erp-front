import { Box, Button, NavLink, Stack } from '@mantine/core';
import { IconBaguette, IconFileDollar, IconHome, IconShoppingCart, IconUserDollar, IconUsers, IconUsersGroup, type TablerIcon } from '@tabler/icons-react';
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
  { ...APP_SECTIONS.CUSTOMERS, icon: IconUserDollar },
  { ...APP_SECTIONS.SALES, icon: IconFileDollar },
  { ...APP_SECTIONS.POS, icon: IconShoppingCart },
];

export const AppSidebar = ({ toggleMobile }: { toggleMobile?: () => void }) => {
  const { data: user } = useProfile();
  const location = useLocation();
  const navigate = useNavigate();
  
  const userLevel = Number(user?.role?.level || 0);
  const menuItems = MENU_ITEMS.filter(item => item.path !== APP_SECTIONS.POS.path && userLevel >= item.minLevel);
  const canSeePos = userLevel >= APP_SECTIONS.POS.minLevel;

  const handleNavigate = (path: string) => {
    navigate(path);
    if (toggleMobile) toggleMobile();
  };

  return (
    <Stack h="100%" justify="space-between" gap="md">
      <Box>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            label={item.label}
            leftSection={<item.icon size={20} stroke={1.5} />}
            // Mantine resalta automáticamente la opción si coincide con la URL actual
            active={location.pathname === item.path}
            onClick={() => handleNavigate(item.path)}
            // Estilos opcionales
            variant="filled"
            style={{ borderRadius: '8px', marginBottom: '4px' }}
          />
        ))}
      </Box>

      {canSeePos && (
        <Button
          fullWidth
          size="md"
          leftSection={<IconShoppingCart size={18} />}
          onClick={() => handleNavigate(APP_SECTIONS.POS.path)}
          variant="gradient"
          gradient={{ from: 'orange.6', to: 'red.7' }}
          styles={{ root: { borderRadius: '14px' } }}
        >
          {APP_SECTIONS.POS.label}
        </Button>
      )}
    </Stack>
  );
};