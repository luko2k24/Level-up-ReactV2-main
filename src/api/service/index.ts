// src/api/service/index.ts - Funciones de servicio COMPLETAS para el backend

import { 
    Producto, 
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    PedidoRequest,
    Pedido 
} from '@/api/api'; 

// URL Base del Backend (Spring Boot 8080)
const API_BASE_URL = 'http://localhost:8080/api/v1';

// Interfaz para Usuarios (Necesaria para el CRUD de Admin)
export interface UsuarioAPI {
    id: number;
    nombreUsuario: string;
    nombreCompleto: string;
    email: string;
    rol: string;
}

// -------------------------------------------------------------------
// UTILIDADES CLAVE (Autenticación y Token)
// -------------------------------------------------------------------

const getAuthHeader = (): Record<string, string> | {} => {
    const token = localStorage.getItem("jwt_token");
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const decodeToken = (token: string): string | null => {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const payload = JSON.parse(jsonPayload);
        return payload.rol || null; 
    } catch (e) {
        return null;
    }
}

const isAnAdmin = (): boolean => {
    const token = localStorage.getItem("jwt_token");
    if (!token) return false;
    
    const rolesString = decodeToken(token); 
    if (!rolesString) return false;

    const rolesArray = rolesString.toUpperCase().split(',').map(role => role.trim());
    return rolesArray.includes('ADMIN') || rolesArray.includes('VENDEDOR');
};

const isAuthenticated = (): boolean => {
    const token = localStorage.getItem("jwt_token");
    return !!token; 
};


// -------------------------------------------------------------------
// FETCH HELPER
// -------------------------------------------------------------------

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    
    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
    }

    if (response.status === 204 || response.headers.get('Content-Length') === '0') {
         return null as T;
    }

    return response.json() as Promise<T>;
}

// -------------------------------------------------------------------
// EXPORTACIÓN DE LA API 
// -------------------------------------------------------------------

export const api = {
    // Controladores de Autenticación
    Auth: {
        login: (request: LoginRequest): Promise<LoginResponse> => {
            return fetchApi<LoginResponse>('/auth/login', { method: 'POST', body: JSON.stringify(request) });
        },
        register: (request: RegisterRequest): Promise<void> => {
            return fetchApi<void>('/auth/registro', { method: 'POST', body: JSON.stringify(request) });
        },
        logout: () => {
            localStorage.removeItem("jwt_token");
        },
        isAnAdmin: isAnAdmin,
        isAuthenticated: isAuthenticated,
        getAuthHeader: getAuthHeader,
        decodeToken: decodeToken
    },
    
    // Controladores de Productos
    Productos: {
        listar: (): Promise<Producto[]> => {
            return fetchApi<Producto[]>('/productos');
        },
        obtenerPorId: (id: number): Promise<Producto> => {
            return fetchApi<Producto>(`/productos/${id}`);
        },
        crear: (payload: any): Promise<Producto> => {
            return fetchApi<Producto>('/admin/productos', { 
                method: 'POST', 
                body: JSON.stringify(payload),
                headers: { ...getAuthHeader() } as HeadersInit
            });
        },
        actualizar: (id: number, payload: any): Promise<Producto> => {
            return fetchApi<Producto>(`/admin/productos/${id}`, { 
                method: 'PUT', 
                body: JSON.stringify(payload),
                headers: { ...getAuthHeader() } as HeadersInit
            });
        },
        eliminar: (id: number): Promise<void> => {
            return fetchApi<void>(`/admin/productos/${id}`, { 
                method: 'DELETE',
                headers: { ...getAuthHeader() } as HeadersInit
            });
        },
    },

    // Controladores de Pedidos
    Pedidos: {
        crearPedido: (request: PedidoRequest): Promise<void> => {
            return fetchApi<void>('/pedidos', {
                method: 'POST',
                body: JSON.stringify(request),
                headers: { ...getAuthHeader() } as HeadersInit
            });
        },
        listar: (): Promise<Pedido[]> => { 
            return fetchApi<Pedido[]>('/pedidos', {
                headers: { ...getAuthHeader() } as HeadersInit
            });
        },
    },

    // 👇 NUEVO BLOQUE: Controladores de Usuarios
    Usuarios: {
        listar: (): Promise<UsuarioAPI[]> => {
            return fetchApi<UsuarioAPI[]>('/admin/usuarios', {
                headers: { ...getAuthHeader() } as HeadersInit
            });
        },
        eliminar: (id: number): Promise<void> => {
            return fetchApi<void>(`/admin/usuarios/${id}`, {
                method: 'DELETE',
                headers: { ...getAuthHeader() } as HeadersInit
            });
        }
    }
};