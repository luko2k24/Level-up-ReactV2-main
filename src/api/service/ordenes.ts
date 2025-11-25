// src/api/service/ordenes.ts

import type { ItemCarrito } from "@/api/api";

const API_URL = "https://tu-api.com/ordenes"; // cambia por tu backend real

export async function crearOrden(items: ItemCarrito[], total: number) {
  const body = {
    items: items.map(i => ({
      id: i.producto.id,
      nombre: i.producto.nombre,
      precio: i.producto.precio,
      cantidad: i.cantidad
    })),
    total,
    fecha: new Date().toISOString(),
  };

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    throw new Error("Error al enviar orden a la API");
  }

  return await res.json();
}
