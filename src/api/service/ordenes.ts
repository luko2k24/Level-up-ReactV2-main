// src/api/service/ordenes.ts

import type { ItemCarrito } from "@/api/api";

const API_URL = "http://localhost:8080/api/v1/pedidos";

export async function crearOrden(items: ItemCarrito[], jwtToken?: string) {
  // 🛑 Usa la clave "token" para coincidir con AuthContext
  const token = jwtToken ?? localStorage.getItem("token"); 
  if (!token) {
    throw new Error("No autorizado: token de autenticación no disponible.");
  }

  // Transformación de datos para el backend
  const payloadItems = items.map((i: any) => ({
    cantidad: i.cantidad ?? i.quantity ?? 1,
    // Solo enviamos el ID del producto
    producto: { id: i.producto?.id ?? i.productId ?? i.id },
  }));

  const body = { items: payloadItems };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Envía el token al backend
      },
      body: JSON.stringify(body),
    });

    if (res.status === 401) {
      throw new Error("No autorizado. Por favor, inicie sesión de nuevo.");
    }

    const text = await res.text();
    let data: any = null;
    try {
      data = text ? JSON.parse(text) : {};
    } catch (e) {
      data = text;
    }

    if (!res.ok) {
      const msg = (data && (data.message || data.error)) || `HTTP ${res.status}`;
      throw new Error(`Error al enviar el pedido al backend: ${msg}`);
    }

    return data;
  } catch (err) {
    console.error("crearOrden - error:", err);
    throw err;
  }
}