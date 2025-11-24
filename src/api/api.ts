// src/types/api.ts (Versión COMPLETA y CORREGIDA)

// Tipos requeridos por Login/Registro
export interface LoginRequest {
    nombreUsuario: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    tipo: 'Bearer';
}

export interface RegisterRequest {
    nombreUsuario: string;
    email: string;
    password: string;
}

// Tipo de las entidades del Backend
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
    // La propiedad 'oferta' es crucial para el tipado en el frontend
    oferta?: boolean; 
}

// Tipos de Pedidos (usados para listar)
export interface Pedido {
    id: number;
    estado: string;
    fechaCreacion: string;
    usuario: { nombreUsuario: string };
    // Este tipo se usa para mapear la respuesta de api.Pedidos.listar()
}

// 🚨 CORRECCIÓN CLAVE: Interfaz para el estado del carrito (ItemCarrito)
export interface ItemCarrito {
    producto: Producto;
    cantidad: number;
}


// Tipos de Peticiones de Pedidos (usado para crear)
export interface ItemPedidoRequest {
    producto: {
        id: number;
    };
    cantidad: number;
}

export interface PedidoRequest {
    items: ItemPedidoRequest[];
}