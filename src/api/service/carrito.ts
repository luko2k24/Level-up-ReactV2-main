// src/services/carrito.ts (Archivo de funciones de bajo nivel)

// 🚨 CORRECCIÓN FINAL: Usamos el alias '@/types/api' para estabilidad en la resolución de módulos.
import { Producto, ItemCarrito } from "@/types/api"; 


// Definición de la clave de almacenamiento
const CLAVE_CARRITO = 'lvl_carrito';

// --- Utilidades de Local Storage ---

function leer<T>(clave: string, valorAlternativo: T): T {
  const crudo = localStorage.getItem(clave)
  
  if (!crudo) return valorAlternativo // Retorno 1
  
  try {
    return JSON.parse(crudo) as T // Retorno 2
  } catch {
    return valorAlternativo // Retorno 3 (Manejo de JSON corrupto)
  }
}

function escribir<T>(clave: string, valor: T): void {
  localStorage.setItem(clave, JSON.stringify(valor))
}

// --- Funciones de Carrito Exportadas (Low-Level) ---

export function obtenerCarrito(): ItemCarrito[] {
  return leer<ItemCarrito[]>(CLAVE_CARRITO, [])
}

export function agregarAlCarrito(producto: Producto, cantidad: number = 1): ItemCarrito[] {
  // Nota: Producto.precio debe ser un 'number' en el frontend
  if (producto.precio <= 0) {
    throw new Error('The product price must be greater than zero to add it to the cart.');
  }
      
  const carrito = obtenerCarrito()
  const productoId = String(producto.id); 
  
  const indice = carrito.findIndex(i => i.id === productoId)
  
  if (indice >= 0) {
    carrito[indice].cantidad += cantidad
  } else {
    carrito.push({
      id: productoId,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad
    } as ItemCarrito)
  }
  escribir(CLAVE_CARRITO, carrito)
  return carrito
}

export function eliminarDelCarrito(id: string): ItemCarrito[] {
  const carrito = obtenerCarrito().filter(i => i.id !== id)
  escribir(CLAVE_CARRITO, carrito)
  return carrito
}

export function vaciarCarrito(): void {
  escribir(CLAVE_CARRITO, [])
}

export function totalCarrito(): number {
  return obtenerCarrito().reduce((acumulador, item) => {
    return item.precio > 0 ? acumulador + item.precio * item.cantidad : acumulador;
  }, 0)
}