import { Navigate, Outlet } from 'react-router-dom';
import { Loader, Center } from '@mantine/core';
import { useProfile } from '../useProfile';

interface Props {
  minLevel: number; // El nivel mínimo requerido para entrar
  children?: React.ReactNode;
}

export const ProtectedRoute = ({ minLevel, children }: Props) => {
  const { data: currentUser, isLoading } = useProfile();

  // 1. Estado de Carga: Fundamental para evitar redirecciones falsas
  // Mientras esperamos al backend, mostramos un spinner.
  if (isLoading) {
    return (
      <Center h="100vh">
        <Loader size="xl" />
      </Center>
    );
  }

  // 2. Seguridad Básica: Si ni siquiera está logueado, lo pateamos al login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // 3. LA LÓGICA DE NEGOCIO: Verificamos el nivel
  // Extraemos el nivel de forma segura asegurándonos de que sea un número
  const userLevel = Number(currentUser.role?.level || 0);

  if (userLevel < minLevel) {
    // Si el usuario es Nivel 1 y la ruta pide Nivel 50, lo mandamos al inicio
    return <Navigate to="/" replace />; 
  }

  // 4. Si pasó todas las validaciones, lo dejamos entrar a la página solicitada
  // Usamos children si lo envuelves directamente, o Outlet si usas rutas anidadas
  return children ? <>{children}</> : <Outlet />;
};