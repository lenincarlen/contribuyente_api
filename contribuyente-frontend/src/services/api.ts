import axios from 'axios';

// Toma la URL del Backend desde las variables de entorno de Vite (.env)
// Si no existe, usa localhost:5097 por defecto como fallback seguro.
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5097/api',
    headers: {
        'Content-Type': 'application/json',
    },
});
