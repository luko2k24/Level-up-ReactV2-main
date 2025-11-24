// src/hooks/useCart.ts

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Producto, ItemCarrito } from '@/api/api'; 
// 🚨 CORRECCIÓN CLAVE: La ruta debe ser '@/api/service/carrito'
import {
  obtenerCarrito,
  agregarAlCarrito,
  eliminarDelCarrito,
  vaciarCarrito,
  totalCarrito,
} from '@/api/service/carrito'; 

/**
 * Hook personalizado para gestionar la lógica del carrito de compras.
 */
export function useCart() {
  const [items, setItems] = useState<ItemCarrito[]>([]);
  const [total, setTotal] = useState<number>(0);

  const actualizarEstado = useCallback(() => {
    setItems(obtenerCarrito());
    setTotal(totalCarrito());
  }, []);

  // Efecto para inicializar el estado la primera vez que se monta
  useEffect(() => {
    actualizarEstado();
  }, [actualizarEstado]);

  // Funciones de acción
  const addItem = useCallback((producto: Producto, cantidad: number = 1) => {
    try {
      agregarAlCarrito(producto, cantidad); 
      actualizarEstado(); 
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
    }
  }, [actualizarEstado]);

  const removeItem = useCallback((id: string) => {
    eliminarDelCarrito(id);
    actualizarEstado();
  }, [actualizarEstado]);

  const clearCart = useCallback(() => {
    vaciarCarrito();
    actualizarEstado();
  }, [actualizarEstado]);
  
  const totalItemsCount = useMemo(() => items.length, [items]);

  // Retornamos la interfaz del hook
  return {
    carrito: items, 
    total,
    totalItemsCount,
    agregar: addItem,
    eliminar: removeItem,
    vaciar: clearCart,
  };
}