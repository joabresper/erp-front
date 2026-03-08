import { Container, Title, Text, Button } from '@mantine/core';
import { useLogout } from '../features/auth/useLogout';

export const DashboardPage = () => {

  const logout = useLogout();

  return (
    <Container p="xl">
      <Title>Bienvenido al ERP</Title>
      <Text>Si ves esto, es porque estás logueado.</Text>
      <Button color="red" onClick={logout} mt="md">
        Cerrar Sesión
      </Button>
    </Container>
  );
};