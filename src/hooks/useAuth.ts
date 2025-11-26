// src/hooks/useAuth.ts
import { useAuthContext } from "@/context/AuthContext";

/**
 * Devuelve el contexto completo de autenticación.
 * Siempre debe usarse dentro del AuthProvider.
 */
export function useAuth() {
  return useAuthContext();
}

/**
 * Devuelve siempre el token actual.
 * Si no está en contexto (ej: refresco), lo obtiene desde localStorage.
 */
export function useAuthToken(): string | null {
  const { token } = useAuthContext();

  // Si está en memoria, usar ese primero
  if (token) return token;

  // Si no, recuperar desde localStorage
  return localStorage.getItem("token");
}
