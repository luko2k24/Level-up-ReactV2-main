import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, UsuarioAPI } from "@/api/service";
import { Producto, Pedido } from "@/api/api";
import {
  FaBoxOpen,
  FaUsers,
  FaClipboardList,
  FaTrash,
  FaEdit,
} from "react-icons/fa";
import "../styles/admin.css";

export default function AdminPanel() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] =
    useState<"productos" | "usuarios" | "pedidos">("productos");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [productos, setProductos] = useState<Producto[]>([]);
  const [usuarios, setUsuarios] = useState<UsuarioAPI[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  const CLP = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  });

  const cargarTodo = async () => {
    setLoading(true);
    try {
      const prodRes = await api.Productos.listar();
      const userRes = await api.Usuarios.listar();
      const pedRes = await api.Pedidos.listar();

      setProductos(prodRes.data ?? []);
      setUsuarios(userRes.data ?? []);
      setPedidos(pedRes.data ?? []);
    } catch (e) {
      setError("Error al conectar con el backend");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!api.Auth.isAuthenticated() || !api.Auth.isAnAdmin()) {
      alert("Acceso denegado");
      navigate("/");
      return;
    }
    cargarTodo();
  }, []);

  if (loading) {
    return <h2 className="text-center text-white mt-5">Cargando panel...</h2>;
  }

  return (
    <div className="container-fluid py-4 bg-dark min-vh-100 text-white">
      <h2 className="fw-bold text-success mb-4">Panel de Administración</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* TABS */}
      <ul className="nav nav-pills mb-4 gap-2">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "productos" ? "active bg-success" : "bg-secondary text-white"}`}
            onClick={() => setActiveTab("productos")}
          >
            <FaBoxOpen /> Productos ({productos.length})
          </button>
        </li>

        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "usuarios" ? "active bg-primary" : "bg-secondary text-white"}`}
            onClick={() => setActiveTab("usuarios")}
          >
            <FaUsers /> Usuarios ({usuarios.length})
          </button>
        </li>

        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "pedidos" ? "active bg-warning text-dark" : "bg-secondary text-white"}`}
            onClick={() => setActiveTab("pedidos")}
          >
            <FaClipboardList /> Pedidos ({pedidos.length})
          </button>
        </li>
      </ul>

      {/* ================= PRODUCTOS ================= */}
      {activeTab === "productos" && (
        <table className="table table-dark table-hover">
          <thead className="table-success text-dark">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Categoría</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.nombre}</td>
                <td>{CLP.format(p.precio)}</td>
                <td>{p.categoria?.nombre ?? p.categoria?.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ================= USUARIOS ================= */}
      {activeTab === "usuarios" && (
        <table className="table table-dark table-hover">
          <thead className="table-primary">
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Email</th>
              <th>Rol</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.nombreUsuario}</td>
                <td>{u.email}</td>
                <td>{u.rol}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ================= PEDIDOS ================= */}
      {activeTab === "pedidos" && (
        <table className="table table-dark table-hover">
          <thead className="table-warning text-dark">
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Estado</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-muted">
                  No hay pedidos registrados
                </td>
              </tr>
            )}

            {pedidos.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.usuario?.nombreUsuario ?? "Compra pública"}</td>
                <td>{p.estado}</td>
                <td>
                  {p.fechaCreacion
                    ? new Date(p.fechaCreacion).toLocaleDateString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
