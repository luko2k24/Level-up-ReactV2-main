// src/api/service/carrito.ts (Archivo de funciones de bajo nivel)

import type { Producto, ItemCarrito } from '@/api/api'; 
// 💡 NOTA: Se asume que ItemCarrito es { producto: Producto, cantidad: number }

// Definición de la clave de almacenamiento
const CLAVE_CARRITO = 'lvl_carrito';


// --- Utilidades de Local Storage (Funciones Auxiliares) ---

// Función para leer el carrito del Local Storage
function leer<T>(clave: string, valorAlternativo: T): T {
    const crudo = localStorage.getItem(clave);
    
    if (!crudo) return valorAlternativo;

    try {
        // Intenta parsear y retorna el objeto
        return JSON.parse(crudo) as T; 
    } catch (e) {
        // Manejo de JSON corrupto
        return valorAlternativo; 
    }
}

// Función para escribir un objeto en Local Storage
function escribir<T>(clave: string, valor: T): void {
    localStorage.setItem(clave, JSON.stringify(valor));
}

// Obtiene el carrito del storage o un array vacío si no existe
export function obtenerCarrito(): ItemCarrito[] {
    return leer<ItemCarrito[]>(CLAVE_CARRITO, []);
}

// --- Funciones de Carrito Exportadas (Low-level) ---

export function agregarAlCarrito(producto: Producto, cantidad: number) {
    const carrito = obtenerCarrito();
    // 💡 CORRECCIÓN 1: Buscar por item.producto.id
    const carritoIndice = carrito.findIndex(i => i.producto.id === producto.id);

    if (carritoIndice >= 0) {
        carrito[carritoIndice].cantidad += cantidad;
    } else {
        // 💡 CORRECCIÓN 2: Estructurar el nuevo item para que coincida con ItemCarrito
        carrito.push({
            producto: producto, 
            cantidad: cantidad,
        } as ItemCarrito);
    }
    escribir(CLAVE_CARRITO, carrito);
    return carrito;
}

export function eliminarDelCarrito(productoId: number | string): ItemCarrito[] {
    const carrito = obtenerCarrito();
    // 💡 CORRECCIÓN 3: Filtrar por item.producto.id
    const nuevoCarrito = carrito.filter(i => i.producto.id !== productoId);
    escribir(CLAVE_CARRITO, nuevoCarrito);
    return nuevoCarrito;
}

export function vaciarCarrito(): void {
    escribir(CLAVE_CARRITO, []);
}

export function totalCarrito(): number {
    const carrito = obtenerCarrito();
    return carrito.reduce((acumulador, item) => {
        // 💡 CORRECCIÓN 4: Acceder a item.producto.precio
        const precioItem = item.producto.precio;
        const cantidadItem = item.cantidad;
        
        return precioItem > 0 
            ? acumulador + (precioItem * cantidadItem)
            : acumulador;
    }, 0);
}