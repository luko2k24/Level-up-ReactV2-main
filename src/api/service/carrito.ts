// src/api/service/carrito.ts

import type { Producto, ItemCarrito } from '@/api/api';

const CLAVE_CARRITO = 'lvl_carrito';

/* ================================
   🔧 Funciones auxiliares
================================ */

function leer<T>(clave: string, valorAlternativo: T): T {
    const crudo = localStorage.getItem(clave);
    if (!crudo) return valorAlternativo;

    try {
        return JSON.parse(crudo) as T;
    } catch (e) {
        return valorAlternativo;
    }
}

function escribir<T>(clave: string, valor: T): void {
    localStorage.setItem(clave, JSON.stringify(valor));
}

export function obtenerCarrito(): ItemCarrito[] {
    return leer<ItemCarrito[]>(CLAVE_CARRITO, []);
}

/* ================================
   🛒 Funciones del Carrito
================================ */

export function agregarAlCarrito(producto: Producto, cantidad: number = 1): ItemCarrito[] {
    const carrito = obtenerCarrito();

    // Buscar si ya existe
    const indice = carrito.findIndex(i => Number(i.producto.id) === Number(producto.id));

    if (indice >= 0) {
        carrito[indice].cantidad += cantidad;
    } else {
        carrito.push({
            producto,
            cantidad
        });
    }

    escribir(CLAVE_CARRITO, carrito);
    return carrito;
}

export function eliminarDelCarrito(productoId: number | string): ItemCarrito[] {
    const idNum = Number(productoId);

    const carrito = obtenerCarrito();

    // FILTRAR DE FORMA CORRECTA POR ID NUMÉRICO
    const nuevoCarrito = carrito.filter(i => Number(i.producto.id) !== idNum);

    escribir(CLAVE_CARRITO, nuevoCarrito);
    return nuevoCarrito;
}

export function vaciarCarrito(): void {
    escribir(CLAVE_CARRITO, []);
}

export function totalCarrito(): number {
    const carrito = obtenerCarrito();
    return carrito.reduce((total, item) => {
        return total + (item.producto.precio * item.cantidad);
    }, 0);
}
