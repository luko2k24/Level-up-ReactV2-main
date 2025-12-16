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

// ===================== API =====================

export const api = {
  // ===================== AUTH =====================
  Auth: {
    login: (data: LoginRequest) =>
      apiClient.post<LoginResponse>("/auth/login", data),

    register: (data: RegisterRequest) =>
      apiClient.post("/auth/registro", data),

    logout: () => {
      localStorage.removeItem("jwt_token");
    },

    isAuthenticated: () => {
      return !!localStorage.getItem("jwt_token");
    },

    isAnAdmin: () => {
      const token = localStorage.getItem("jwt_token");
      if (!token) return false;

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const roles = payload.role || payload.rol || "";
        return roles.toUpperCase().includes("ROLE_ADMIN");
      } catch {
        return false;
      }
    }
  },

  // ===================== PRODUCTOS =====================
  Productos: {
    listar: () =>
      apiClient.get<Producto[]>("/productos"),

    // 🔥🔥 ESTE ES EL MÉTODO QUE FALTABA 🔥🔥
    obtenerPorId: (id: number) =>
      apiClient.get<Producto>(`/productos/${id}`),

    crear: (data: any) =>
      apiClient.post("/admin/productos", data),

    actualizar: (id: number, data: any) =>
      apiClient.put(`/admin/productos/${id}`, data),

    eliminar: (id: number) =>
      apiClient.delete(`/admin/productos/${id}`)
  },

  // ===================== USUARIOS =====================
  Usuarios: {
    listar: () =>
      apiClient.get<UsuarioAPI[]>("/admin/usuarios"),

    eliminar: (id: number) =>
      apiClient.delete(`/admin/usuarios/${id}`)
  },

  // ===================== PEDIDOS =====================
  Pedidos: {
    listar: () =>
      apiClient.get<Pedido[]>("/pedidos"),

    crearPedido: (data: PedidoRequest) =>
      apiClient.post("/pedidos", data)
  }
};
