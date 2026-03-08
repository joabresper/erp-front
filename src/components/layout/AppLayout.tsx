import { AppShell, Burger, Group, Text, Title, Avatar, Menu } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconLogout } from '@tabler/icons-react';
import { Outlet } from 'react-router-dom';
import { useLogout } from '../../features/auth/useLogout';
import { useProfile } from '../../features/auth/useProfile';
import { AppSidebar } from './AppSidebar';

export const AppLayout = () => {
  const [opened, { toggle }] = useDisclosure();
  
  // Recuperamos el usuario (en el futuro esto vendrá de un Context)
  const { data: user } = useProfile();


  const logout = useLogout();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Title order={3}>Mi ERP</Title>
          </Group>
          
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Group gap="xs" style={{ cursor: 'pointer' }}>
                <Text size="sm" fw={500}>{user?.fullName}</Text>
                <Avatar color="blue" radius="xl">{user?.fullName?.[0]?.toUpperCase()}</Avatar>
              </Group>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Cuenta</Menu.Label>
              <Menu.Item leftSection={<IconLogout size={14} />} color="red" onClick={logout}>
                Cerrar Sesión
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <AppSidebar toggleMobile={toggle} />
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet /> {/* Aquí se renderizan las páginas hijas */}
      </AppShell.Main>
    </AppShell>
  );
};