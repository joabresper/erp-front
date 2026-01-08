import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // O el puerto donde corra tu NestJS
});

// Tip: Acá podés agregar interceptores después para meter el Token JWT automáticamente
export default api;