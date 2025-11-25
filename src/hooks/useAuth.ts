// src/hooks/useAuth.ts

import { useState, useEffect } from 'react';

// Esta función se encarga de obtener el token JWT que guardaste al iniciar sesión.
export function useAuthToken(): string | null {
    // 🚨 AJUSTA ESTA CLAVE: Si usas una clave diferente para guardar el token en localStorage,
    // cámbiala aquí (ej. 'accessToken', 'userToken', etc.).
    const token = localStorage.getItem('jwtToken');
    
    return token;
}

// Opcionalmente, si manejas el estado de usuario:
/*
export function useAuth() {
    // ... lógica de contexto de usuario ...
    const token = localStorage.getItem('jwtToken');
    return { token, isAuthenticated: !!token };
}
*/