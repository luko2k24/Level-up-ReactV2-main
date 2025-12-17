// src/api/config.ts

// En desarrollo usamos el proxy de Vite (mismo origen) para evitar CORS.
// Se puede sobreescribir con VITE_API_BASE_URL si el frontend se despliega separado.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';