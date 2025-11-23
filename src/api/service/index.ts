// src/api/service/index.ts

// 1. Importaciones corregidas para la nueva estructura (../config) y (../../types/api)
// Nota: La ruta de importación de API_BASE_URL (../config) parece lógica según tu estructura de carpetas.
import { API_BASE_URL } from '../config'; 
import { 
    LoginRequest, 
    LoginResponse, 
    RegisterRequest, 
    Producto, 
    PedidoRequest 
} from '../../types/api'; 


// 🚀 NUEVO TIPO: Define exactamente el DTO que Spring Boot espera para CREAR/ACTUALIZAR.
// Esto resuelve el error de tipado en Admin.tsx
export type ProductoPayload = {
    nombre: string;
    descripcion: string;
    precio: number;
    categoria: { id: number }; // Solo se envía el ID a la API para asociar la categoría
};


// 🚀 FUNCIÓN AUXILIAR: Decodificar el JWT para leer roles y expiración
const decodeJwt = (token: string): { sub: string, rol: string, exp: number } | null => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        // Usamos atob para decodificar Base64
        return JSON.parse(decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join('')));
    } catch (e) {
        return null;
    }
};


// --- 🔑 Función Core para Manejo de JWT (fetchWithAuth) ---
async function fetchWithAuth<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: object,
    skipAuth: boolean = false
): Promise<T> {
    const token = localStorage.getItem('jwtToken');
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    // Adjuntamos el token si existe y no se está omitiendo (ej. en Login y Registro)
    if (token && !skipAuth) {
        headers['Authorization'] = `Bearer ${token}`; 
    }

    const config: RequestInit = {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    };

    const url = `${API_BASE_URL}/${endpoint}`;
    const response = await fetch(url, config);
        
    // Manejo de errores de autenticación/autorización (401/403)
    if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('jwtToken');
        throw new Error('Sesión no válida o expirada. Por favor, inicia sesión de nuevo.');
    }

    if (!response.ok) {
        // Intentamos obtener el texto del error que Spring Boot envía (ej. "Nombre de usuario ya existe.")
        const errorBody = await response.text();
        throw new Error(`Error ${response.status}: ${errorBody || 'Petición fallida'}`);
    }
        
    // Manejo de respuestas sin contenido (204 No Content)
    if (response.status === 204 || response.headers.get('Content-Length') === '0') {
        return null as T;
    }

    return response.json() as Promise<T>;
}

// --- Servicios Funcionales ---

export const AuthService = {
    
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        // skipAuth: true porque esta es la ruta para obtener el token
        const data = await fetchWithAuth<LoginResponse>('auth/login', 'POST', credentials, true); 
        if (data.token) {
            localStorage.setItem('jwtToken', data.token); 
        }
        return data;
    },
    
    register: async (userData: RegisterRequest): Promise<void> => {
        // skipAuth: true porque no podemos tener token antes de registrarnos
        await fetchWithAuth<void>('auth/registro', 'POST', userData, true);
    },

    logout: (): void => {
        localStorage.removeItem('jwtToken');
    },

    isAuthenticated: (): boolean => {
        const token = localStorage.getItem('jwtToken');
        if (!token) return false;
        
        const payload = decodeJwt(token);
        if (payload && payload.exp) {
            const now = Date.now() / 1000;
            // Verifica si el token ha expirado
            return payload.exp > now;
        }
        return true;
    },

    isAdmin: (): boolean => {
        const token = localStorage.getItem('jwtToken');
        if (!token) return false;
        
        const payload = decodeJwt(token);
        
        if (payload && payload.rol) { 
            // El backend JwtUtil.java une los roles con comas (ej. "CLIENTE,ADMIN")
            const roles = String(payload.rol).split(',');
            return roles.includes('ADMIN'); 
        }
        
        return false;
    }
};

export const ProductosService = {
    // La lista de productos y la obtención por ID son rutas públicas (skipAuth: true)
    listar: async (): Promise<Producto[]> => {
        return fetchWithAuth<Producto[]>('productos', 'GET', undefined, true);
    },
    
    obtenerPorId: async (id: number): Promise<Producto> => {
        return fetchWithAuth<Producto>(`productos/${id}`, 'GET', undefined, true);
    },

    // Las funciones de administración usan la ruta /admin/productos y requieren JWT
    crear: async (productoData: ProductoPayload): Promise<Producto> => {
        return fetchWithAuth<Producto>('admin/productos', 'POST', productoData); 
    },

    actualizar: async (id: number, productoData: ProductoPayload): Promise<Producto> => {
        return fetchWithAuth<Producto>(`admin/productos/${id}`, 'PUT', productoData); 
    },
    
    eliminar: async (id: number): Promise<void> => {
        return fetchWithAuth<void>(`admin/productos/${id}`, 'DELETE');
    },
};

export const PedidosService = {
    // La creación de pedidos requiere que el usuario esté autenticado (el token se inyecta)
    crear: async (pedidoData: PedidoRequest): Promise<any> => {
        return fetchWithAuth<any>('pedidos', 'POST', pedidoData); 
    },
    
    // Listar pedidos requiere roles ADMIN o VENDEDOR (el token se inyecta y es validado en el backend)
    listarTodos: async (): Promise<any[]> => {
        return fetchWithAuth<any[]>('pedidos', 'GET');
    },
};


export const api = {
    Auth: AuthService,
    Productos: ProductosService,
    Pedidos: PedidosService,
};