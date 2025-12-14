import {
  Producto,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  PedidoRequest,
  Pedido
} from "@/api/api";

const API_BASE_URL = "http://localhost:8080/api/v1";

export interface UsuarioAPI {
  id: number;
  nombreUsuario: string;
  nombreCompleto: string;
  email: string;
  rol: string;
}

// ===================== JWT HELPERS =====================

const getAuthHeader = (): Record<string, string> => {
  const token = localStorage.getItem("jwt_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const decodeToken = (token: string): string | null => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role || payload.rol || null;
  } catch {
    return null;
  }
};

const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("jwt_token");
};

const isAnAdmin = (): boolean => {
  const token = localStorage.getItem("jwt_token");
  if (!token) return false;

  const roles = decodeToken(token);
  if (!roles) return false;

  return roles
    .toUpperCase()
    .split(",")
    .includes("ROLE_ADMIN");
};

// ===================== FETCH =====================

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    }
  });

  if (!res.ok) throw new Error(res.statusText);
  if (res.status === 204) return null as T;
  return res.json();
}

// ===================== API =====================

export const api = {
  Auth: {
    login: (data: LoginRequest) =>
      fetchApi<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(data)
      }),
    register: (data: RegisterRequest) =>
      fetchApi<void>("/auth/registro", {
        method: "POST",
        body: JSON.stringify(data)
      }),
    logout: () => localStorage.removeItem("jwt_token"),
    isAuthenticated,
    isAnAdmin
  },

  Productos: {
    listar: () => fetchApi<Producto[]>("/productos"),
    crear: (data: any) =>
      fetchApi("/admin/productos", {
        method: "POST",
        body: JSON.stringify(data),
        headers: getAuthHeader()
      }),
    actualizar: (id: number, data: any) =>
      fetchApi(`/admin/productos/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: getAuthHeader()
      }),
    eliminar: (id: number) =>
      fetchApi(`/admin/productos/${id}`, {
        method: "DELETE",
        headers: getAuthHeader()
      })
  },

  Usuarios: {
    listar: () =>
      fetchApi<UsuarioAPI[]>("/admin/usuarios", {
        headers: getAuthHeader()
      }),
    eliminar: (id: number) =>
      fetchApi(`/admin/usuarios/${id}`, {
        method: "DELETE",
        headers: getAuthHeader()
      })
  },

  Pedidos: {
    listar: () =>
      fetchApi<Pedido[]>("/pedidos", {
        headers: getAuthHeader()
      }),
    crearPedido: (data: PedidoRequest) =>
      fetchApi("/pedidos", {
        method: "POST",
        body: JSON.stringify(data),
        headers: getAuthHeader()
      })
  }
};
