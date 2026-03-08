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

export default api;