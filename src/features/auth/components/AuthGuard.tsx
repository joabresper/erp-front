import { Navigate, Outlet } from 'react-router-dom';

export const AuthGuard = () => {
  // Aquí validamos si existe el token. 
  // Más adelante podemos conectar esto a un Contexto global.
  const token = localStorage.getItem('token'); // O tu key 'accessToken'
  const user = localStorage.getItem('user');

  // Si no hay token, lo pateamos al login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Si hay token, renderizamos el contenido interno (el ERP)
  return <Outlet />;
};