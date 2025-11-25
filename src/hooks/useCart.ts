// src/hooks/useCart.ts

import { useEffect, useState } from 'react';
import type { Producto, ItemCarrito } from '@/api/api';

import {
    obtenerCarrito,
    agregarAlCarrito,
    eliminarDelCarrito as eliminarAPI,
    vaciarCarrito as vaciarAPI,
    totalCarrito
} from '@/api/service/carrito';

/*
    Este hook administra todo el carrito en React.
    - Sincroniza automáticamente con LocalStorage
    - Expone funciones limpias y fáciles de usar
*/

export function useCart() {

    // Estado del carrito en React
    const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
    const [total, setTotal] = useState<number>(0);

    // Cargar carrito al iniciar
    useEffect(() => {
        setCarrito(obtenerCarrito());
        setTotal(totalCarrito());
    }, []);

    // --- Métodos del carrito (con re-render inmediato) ---

    const agregar = (producto: Producto, cantidad: number = 1) => {
        const nuevoCarrito = agregarAlCarrito(producto, cantidad);
        setCarrito([...nuevoCarrito]);
        setTotal(totalCarrito());
    };

    const eliminar = (productoId: number | string) => {
        const nuevoCarrito = eliminarAPI(productoId);
        setCarrito([...nuevoCarrito]);
        setTotal(totalCarrito());
    };

    const vaciar = () => {
        vaciarAPI();
        setCarrito([]);
        setTotal(0);
    };

    // --- API del hook ---
    return {
        carrito,
        total,
        agregar,
        eliminar,
        vaciar
    };
}
