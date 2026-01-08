import { AppShell, Burger, Group, NavLink, Text, Title, Avatar, Menu } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconUsers, IconLogout } from '@tabler/icons-react';
import { Outlet, useNavigate } from 'react-router-dom';

export const AppLayout = () => {
  const [opened, { toggle }] = useDisclosure();
  const navigate = useNavigate();
  
  // Recuperamos el usuario (en el futuro esto vendrá de un Context)
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

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
                <Text size="sm" fw={500}>{user.nombre}</Text>
                <Avatar color="blue" radius="xl">{user.nombre?.[0]}</Avatar>
              </Group>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Cuenta</Menu.Label>
              <Menu.Item leftSection={<IconLogout size={14} />} color="red" onClick={handleLogout}>
                Cerrar Sesión
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <NavLink 
            label="Gestión de Usuarios" 
            leftSection={<IconUsers size="1rem" stroke={1.5} />} 
            onClick={() => navigate('/users')}
            active={window.location.pathname.startsWith('/users')}
        />
        {/* Aquí irán Facturas, Lotes, etc. */}
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet /> {/* Aquí se renderizan las páginas hijas */}
      </AppShell.Main>
    </AppShell>
  );
};