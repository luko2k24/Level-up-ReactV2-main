import {
  Producto,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  PedidoRequest,
  Pedido
} from "@/api/api";

import { apiClient } from "./apiClient";

export interface UsuarioAPI {
  id: number;
  nombreUsuario: string;
  nombreCompleto: string;
  email: string;
  rol: string;
}

export const api = {
  Auth: {
    login: (data: LoginRequest) =>
      apiClient.post<LoginResponse>("/auth/login", data),

    register: (data: RegisterRequest) =>
      apiClient.post("/auth/registro", data),

    logout: () => {
      localStorage.removeItem("token");
    },

    isAuthenticated: () => {
      return !!localStorage.getItem("token");
    },

    // 🔥 CORRECTO PARA SPRING SECURITY
    isAnAdmin: () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    const role =
      payload.role ||
      payload.rol ||
      (Array.isArray(payload.roles) && payload.roles[0]) ||
      (Array.isArray(payload.authorities) && payload.authorities[0]) ||
      "";

    // ✅ ACEPTA ADMIN EN TODAS LAS FORMAS
    return (
      role === "ADMIN" ||
      role === "ROLE_ADMIN" ||
      role.includes("ADMIN")
    );
  } catch {
    return false;
  }
}
  },

  Productos: {
    listar: () => apiClient.get<Producto[]>("/productos"),
    obtenerPorId: (id: number) =>
      apiClient.get<Producto>(`/productos/${id}`),
    crear: (data: any) =>
      apiClient.post("/productos/admin", data),
    actualizar: (id: number, data: any) =>
      apiClient.put(`/productos/admin/${id}`, data),
    eliminar: (id: number) =>
      apiClient.delete(`/productos/admin/${id}`)
  },

  Usuarios: {
    listar: () => apiClient.get<UsuarioAPI[]>("/admin/usuarios"),
    eliminar: (id: number) =>
      apiClient.delete(`/admin/usuarios/${id}`)
  },

  Pedidos: {
    listar: () => apiClient.get<Pedido[]>("/pedidos"),
    crearPedido: (data: PedidoRequest) =>
      apiClient.post("/pedidos", data)
  }
};
