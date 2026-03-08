import { Navigate, Outlet } from 'react-router-dom';

export const PublicGuard = () => {
  const accessToken = localStorage.getItem('accessToken');

  // Si YA está logueado, lo mandamos directo al Dashboard (root)
  if (accessToken) {
    return <Navigate to="/" replace />;
  }

  // Si no está logueado, dejamos que vea el Login
  return <Outlet />;
};