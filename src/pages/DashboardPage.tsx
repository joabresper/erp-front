import { Container, Title, Text, Button } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

export const DashboardPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Container p="xl">
      <Title>Bienvenido al ERP</Title>
      <Text>Si ves esto, es porque estás logueado.</Text>
      <Button color="red" onClick={handleLogout} mt="md">
        Cerrar Sesión
      </Button>
    </Container>
  );
};