import { Navigate, Outlet } from 'react-router-dom';

export const PublicGuard = () => {
  const token = localStorage.getItem('token');

  // Si YA está logueado, lo mandamos directo al Dashboard (root)
  if (token) {
    return <Navigate to="/" replace />;
  }

  // Si no está logueado, dejamos que vea el Login
  return <Outlet />;
};