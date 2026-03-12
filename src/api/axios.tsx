import { notifications } from '@mantine/notifications';
import { IconShieldX } from '@tabler/icons-react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // O el puerto donde corra tu NestJS
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  // Si hay un token guardado, se lo inyecta a la cabecera
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  // Tratmiento de los errores de falta de permisos
  (error) => {
    if (error.response && error.response.status === 403) {
      notifications.show({
        title: 'Acceso denegado',
        message: error.response.data?.message || 'No tienes permisos para realizar esta acción.',
        color: 'red',
        icon: <IconShieldX size={18} />,
        autoClose: 5000
      });
    }
    return Promise.reject(error);
  }
)

export default api;