// src/types/api.ts (Versión COMPLETA y CORREGIDA)

// ----------------------
// TIPOS PARA LOGIN
// ----------------------
export interface LoginRequest {
    nombreUsuario: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    tipo: 'Bearer';
}

// ----------------------
// TIPOS PARA REGISTRO
// ----------------------
export interface RegisterRequest {
    nombreUsuario: string;
    email: string;
    password: string;

    // 🔥 CAMPOS REQUERIDOS POR EL BACKEND
    nombreCompleto: string;
    edad: number;
    region: string;
    comuna: string;
}

// ----------------------
// ENTIDADES DEL BACKEND
// ----------------------
export interface Categoria {
    id: number;
    nombre: string;
}

export interface Producto {
    id: number;
    nombre: string;
    descripcion?: string;
    precio: number;
    urlImagen?: string;
    categoria: Categoria;

    // Importante para ofertas
    oferta?: boolean;
}

// ----------------------
// TIPOS PARA PEDIDOS
// ----------------------
export interface Pedido {
    id: number;
    estado: string;
    fechaCreacion: string;
    usuario: {
        nombreUsuario: string;
    };
}

// ----------------------
// CARRITO
// ----------------------
export interface ItemCarrito {
    producto: Producto;
    cantidad: number;
}

// ----------------------
// REQUEST PARA CREAR PEDIDOS
// ----------------------
export interface ItemPedidoRequest {
    producto: {
        id: number;
    };
    cantidad: number;
}

export interface PedidoRequest {
    items: ItemPedidoRequest[];
}
