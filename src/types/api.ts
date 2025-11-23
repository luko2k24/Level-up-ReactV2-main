// src/types/api.ts

// --- General Models ---

export interface Categoria {
    id: number | null;
    nombre: string;
}

export interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number; 
    categoria: Categoria;
}

export interface ItemCarrito {
    id: string; // ID del producto (usado como string en localStorage)
    nombre: string;
    precio: number;
    cantidad: number;
}


// --- Authentication DTOs ---

export interface LoginRequest {
    nombreUsuario: string;
    password: string;
}

export interface RegisterRequest {
    nombreUsuario: string;
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    tipo: string; // "Bearer"
}


// --- Transaction DTOs (The missing types) ---

// Lo que el backend espera en el cuerpo de la petición para cada ítem de la boleta.
export interface ItemPedidoRequest {
    producto: {
        id: number;
    };
    cantidad: number;
}

// Lo que el backend espera para el pedido completo (Boleta)
// El usuario se infiere del JWT.
export interface PedidoRequest {
    items: ItemPedidoRequest[];
}