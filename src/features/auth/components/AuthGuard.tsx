import { Navigate, Outlet } from 'react-router-dom';
import { useProfile } from '../useProfile';
import { Center, Loader } from '@mantine/core';

export const AuthGuard = () => {
  // Aquí validamos si existe el token. 
  // Más adelante podemos conectar esto a un Contexto global.
  const accessToken = localStorage.getItem('accessToken');

  // Disparamos la búsqueda del usuario usando el token
  const { data: user, isLoading, isError } = useProfile();

  // Si no hay token, lo pateamos al login
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  // Mientras se busca el user se muestra un spinner
  if (isLoading) {
    return (
      <Center h="100vh">
        <Loader size="xl" />
      </Center>
    );
  }

  // Si el backend rechaza el token (isError) o no devolvió usuario
  if (isError || !user) {
    localStorage.removeItem('accessToken');
    return <Navigate to="/login" replace />;
  }

  // Si hay token, renderizamos el contenido interno (el ERP)
  return <Outlet />;
};