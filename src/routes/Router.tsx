import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PublicGuard, AuthGuard } from '../features/auth';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginPage } from '../pages/LoginPage';

export const router = createBrowserRouter([
  {
    // RUTAS PÚBLICAS (Solo accesibles si NO estás logueado)
    element: <PublicGuard />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
    ],
  },
  {
    // RUTAS PRIVADAS (Solo accesibles si SÍ estás logueado)
    element: <AuthGuard />,
    children: [
      {
        path: '/',
        element: <DashboardPage />, 
      },
      // Aquí agregarás más rutas a futuro:
      // { path: '/ventas', element: <VentasPage /> },
      // { path: '/usuarios', element: <UsuariosPage /> },
    ],
  },
  {
    // CUALQUIER OTRA RUTA (404)
    path: '*',
    element: <Navigate to="/" replace />, // Redirige al root (el AuthGuard decidirá si va a login o dashboard)
  }
]);