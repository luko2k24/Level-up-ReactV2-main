// src/api/service/ordenes.ts

import type { ItemCarrito } from "@/api/api";

// 🛑 1. URL CORREGIDA: Apunta al endpoint de pedidos del backend (puerto 8080)
const API_URL = "http://localhost:8080/api/v1/pedidos"; 

// 🛑 2. Ahora espera el token JWT
export async function crearOrden(items: ItemCarrito[], jwtToken: string) {
    
    // 🛑 3. ESTRUCTURA DEL PAYLOAD: El backend solo necesita cantidad y ID del producto
    const payloadItems = items.map(i => ({
        cantidad: i.cantidad,
        producto: {
            id: i.producto.id
        }
    }));

    const body = {
        items: payloadItems
    };

    const res = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            // 🛑 4. CLAVE: Encabezado de autenticación con el token
            "Authorization": `Bearer ${jwtToken}`
        },
        body: JSON.stringify(body)
    });

    if (res.status === 401) {
        throw new Error("No autorizado. Por favor, inicie sesión de nuevo.");
    }
    if (!res.ok) {
        throw new Error("Error al enviar el pedido al backend. Revise el estado del backend (productos/precios).");
    }

    return await res.json();
}