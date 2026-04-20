import { notifications } from '@mantine/notifications';
import { IconExclamationCircle, IconLockQuestion, IconShieldX } from '@tabler/icons-react';
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

const autoCloseTime = 2000;
api.interceptors.response.use(
  (response) => {
    // Las notificaciones de éxito se manejan en los componentes (notificationService)
    // El interceptor solo maneja errores HTTP
    return response;
  },
  // Tratmiento de los errores de falta de permisos
  (error) => {
    if (error.response && error.response.status === 401) {
      notifications.show({
        title: 'Sesión expirada',
        message: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
        color: 'red',
        icon: <IconLockQuestion size={18} />,
        autoClose: autoCloseTime
      });
    }
    if (error.response && error.response.status === 403) {
      notifications.show({
        title: 'Acceso denegado',
        message: error.response.data?.message || 'No tienes permisos para realizar esta acción.',
        color: 'red',
        icon: <IconShieldX size={18} />,
        autoClose: autoCloseTime
      });
    }
    if (error.response && error.response.status === 404) {
      notifications.show({
        title: 'Elemento no encontrado',
        message: 'El elemento solicitado no fue encontrado.',
        color: 'red',
        icon: <IconExclamationCircle size={18} />,
        autoClose: autoCloseTime
      });
    }
    if (error.response && error.response.status === 400) {
      notifications.show({
        title: 'Solicitud inválida',
        message: error.response.data?.message || 'La solicitud enviada no es válida.',
        color: 'red',
        icon: <IconExclamationCircle size={18} />,
        autoClose: autoCloseTime
      });
    }
    return Promise.reject(error);
  }
)

export default api;

