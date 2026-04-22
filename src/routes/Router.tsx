import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PublicGuard, AuthGuard } from '../features/auth';
import { LoginPage } from '../pages/LoginPage';
import { UsersList } from '../features/users/components/UsersList';
import { AppLayout } from '../components/layout/AppLayout';
import { DashboardPage } from '../pages/DashboardPage';
import { PosPage } from '../pages/PosPage';
import { ProtectedRoute } from '../features/auth/components/ProtectedRoute';
import { RolesList } from '../features/roles/components/RolesList';
import { ProductsList } from '../features/products/components/ProductsList';
import { CustomersList } from '../features/customers/components/CustomersList';
import { SalesList } from '../features/sales/components/SalesList';
import { APP_SECTIONS } from '../components/common/configuration/app-sections';
import { RootRedirect } from './RootRedirect';

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
          { index: true, element: <RootRedirect /> },
          {
            path: APP_SECTIONS.DASHBOARD.path,
            element:
              <ProtectedRoute minLevel={APP_SECTIONS.DASHBOARD.minLevel}>
                <DashboardPage />
              </ProtectedRoute>
          },
          {
            path: APP_SECTIONS.USERS.path,
            element: (
              <ProtectedRoute minLevel={APP_SECTIONS.USERS.minLevel}>
                <UsersList />
              </ProtectedRoute>
            )
          },
          {
            path: APP_SECTIONS.ROLES.path,
            element: (
              <ProtectedRoute minLevel={APP_SECTIONS.ROLES.minLevel}>
                <RolesList />
              </ProtectedRoute>
            )
          },
          {
            path: APP_SECTIONS.PRODUCTS.path,
            element: (
              <ProtectedRoute minLevel={APP_SECTIONS.PRODUCTS.minLevel}>
                <ProductsList />
              </ProtectedRoute>
            )
          },
          {
            path: APP_SECTIONS.CUSTOMERS.path,
            element: (
              <ProtectedRoute minLevel={APP_SECTIONS.CUSTOMERS.minLevel}>
                <CustomersList />
              </ProtectedRoute>
            )
          },
          { path: APP_SECTIONS.SALES.path,
            element: (
              <ProtectedRoute minLevel={APP_SECTIONS.SALES.minLevel}>
                <SalesList />
              </ProtectedRoute>
            )
          },
          {
            path: APP_SECTIONS.POS.path,
            element: (
              <ProtectedRoute minLevel={APP_SECTIONS.POS.minLevel}>
                <PosPage />
              </ProtectedRoute>
            ),
          },
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