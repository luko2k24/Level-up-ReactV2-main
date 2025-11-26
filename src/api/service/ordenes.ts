// src/api/service/ordenes.ts

const API_URL = "http://localhost:8080/api/v1/pedidos";

export async function crearOrden(pedidoBody: any, jwtToken?: string) {
  const token = jwtToken ?? localStorage.getItem("token");
  if (!token) throw new Error("No autorizado: token ausente.");

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(pedidoBody),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Backend error:", text);
    throw new Error(`Error HTTP ${res.status}`);
  }

  return res.json();
}
