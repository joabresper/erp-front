import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const logout = () => {
    // Borrar el token de seguridad
    localStorage.removeItem('accessToken');

    // Destruye toda la caché de React Query en memoria
    queryClient.clear(); 

    // Patear al usuario a la pantalla de login
    navigate('/login', { replace: true }); 
    // Usamos replace: true para que el usuario no pueda volver atrás con la flecha del navegador
  };
  // El hook devuelve la función lista para usar
  return logout; 
};