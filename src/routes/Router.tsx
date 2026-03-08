import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PublicGuard, AuthGuard } from '../features/auth';
import { LoginPage } from '../pages/LoginPage';
import { UsersList } from '../features/users/components/UsersList';
import { AppLayout } from '../components/layout/AppLayout';
import { DashboardPage } from '../pages/DashboardPage';
import { ProtectedRoute } from '../features/auth/components/ProtectedRoute';

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
    element: <AuthGuard />,
    children: [
      {
        path: '/',
        element: <AppLayout />, // El Layout envuelve todo lo privado
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> }, // Redirección temporal
          {
            path: 'users',
            element: (
              <ProtectedRoute minLevel={50}>
                <UsersList />
              </ProtectedRoute>
            )
          },
          {
            path: 'dashboard',
            element: <DashboardPage />
          }
          // { path: '/ventas', element: <VentasPage /> },
          // { path: '/usuarios', element: <UsuariosPage /> },
        ],
      }
    ],
  },
  {
    // CUALQUIER OTRA RUTA (404)
    path: '*',
    element: <Navigate to="/" replace />, // Redirige al root (el AuthGuard decidirá si va a login o dashboard)
  }
]);