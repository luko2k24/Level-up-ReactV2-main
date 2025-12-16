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

// ================= FORMULARIO PRODUCTO =================
interface FormularioProducto {
  id: number | "";
  nombre: string;
  descripcion: string;
  precio: number | "";
  categoriaId: number | "";
}

const FORM_INICIAL: FormularioProducto = {
  id: "",
  nombre: "",
  descripcion: "",
  precio: "",
  categoriaId: 1,
};

const CLP = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

export default function AdminPanel() {
  const navigate = useNavigate();

  // ================= ESTADOS =================
  const [activeTab, setActiveTab] =
    useState<"productos" | "usuarios" | "pedidos">("productos");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [productos, setProductos] = useState<Producto[]>([]);
  const [usuarios, setUsuarios] = useState<UsuarioAPI[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  const [form, setForm] = useState<FormularioProducto>(FORM_INICIAL);
  const [editing, setEditing] = useState(false);

  // ================= CARGAR DATOS =================
  const cargarTodo = async () => {
    setLoading(true);
    setError("");

    try {
      const prodRes = await api.Productos.listar();
      setProductos(Array.isArray(prodRes.data) ? prodRes.data : []);

      try {
        const userRes = await api.Usuarios.listar();
        setUsuarios(Array.isArray(userRes.data) ? userRes.data : []);
      } catch {}

      try {
        const pedRes = await api.Pedidos.listar();
        setPedidos(Array.isArray(pedRes.data) ? pedRes.data : []);
      } catch {}
    } catch (e) {
      console.error(e);
      setError("Error de conexión con el backend");
    } finally {
      setLoading(false);
    }
  };

  // ================= GUARD ADMIN =================
  useEffect(() => {
    if (!api.Auth.isAuthenticated() || !api.Auth.isAnAdmin()) {
      alert("Acceso denegado. Debes ser Administrador.");
      navigate("/");
      return;
    }
    cargarTodo();
  }, [navigate]);

  // ================= CRUD PRODUCTOS =================
  const guardarProducto = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      precio: Number(form.precio),
      categoria: { id: Number(form.categoriaId) },
    };

    try {
      if (editing) {
        await api.Productos.actualizar(Number(form.id), payload);
      } else {
        await api.Productos.crear(payload);
      }

      setForm(FORM_INICIAL);
      setEditing(false);
      cargarTodo();
    } catch {
      alert("Error al guardar producto");
    }
  };

  const eliminarProducto = async (id: number) => {
    if (!confirm("¿Eliminar producto?")) return;
    await api.Productos.eliminar(id);
    cargarTodo();
  };

  const eliminarUsuario = async (id: number) => {
    if (!confirm("¿Eliminar usuario?")) return;
    await api.Usuarios.eliminar(id);
    cargarTodo();
  };

  if (loading) {
    return (
      <div className="text-center mt-5 text-white">
        <h2>Cargando Panel...</h2>
      </div>
    );
  }

  // ================= RENDER =================
  return (
    <div className="container-fluid py-4 bg-dark min-vh-100 text-white">
      <h2 className="fw-bold text-success mb-4">Panel de Administración</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* ================= TABS ================= */}
      <ul className="nav nav-pills mb-4 gap-2">
        <li className="nav-item">
          <button
            className={`nav-link ${
              activeTab === "productos"
                ? "active bg-success"
                : "bg-secondary text-white"
            }`}
            onClick={() => setActiveTab("productos")}
          >
            <FaBoxOpen /> Productos ({productos.length})
          </button>
        </li>

        <li className="nav-item">
          <button
            className={`nav-link ${
              activeTab === "usuarios"
                ? "active bg-primary"
                : "bg-secondary text-white"
            }`}
            onClick={() => setActiveTab("usuarios")}
          >
            <FaUsers /> Usuarios ({usuarios.length})
          </button>
        </li>

        <li className="nav-item">
          <button
            className={`nav-link ${
              activeTab === "pedidos"
                ? "active bg-warning text-dark"
                : "bg-secondary text-white"
            }`}
            onClick={() => setActiveTab("pedidos")}
          >
            <FaClipboardList /> Pedidos ({pedidos.length})
          </button>
        </li>
      </ul>

      {/* ================= PRODUCTOS ================= */}
      {activeTab === "productos" && (
        <>
          {/* FORMULARIO */}
          <div className="card bg-secondary text-white mb-4">
            <div className="card-header fw-bold">
              {editing ? "Editar Producto" : "Crear Producto"}
            </div>
            <div className="card-body">
              <form onSubmit={guardarProducto}>
                <div className="row">
                  <div className="col-md-4 mb-2">
                    <label>Nombre</label>
                    <input
                      className="form-control"
                      value={form.nombre}
                      onChange={(e) =>
                        setForm({ ...form, nombre: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="col-md-4 mb-2">
                    <label>Precio</label>
                    <input
                      type="number"
                      className="form-control"
                      value={form.precio}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          precio:
                            e.target.value === ""
                              ? ""
                              : Number(e.target.value),
                        })
                      }
                      required
                    />
                  </div>

                  <div className="col-md-4 mb-2">
                    <label>ID Categoría</label>
                    <input
                      type="number"
                      className="form-control"
                      value={form.categoriaId}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          categoriaId:
                            e.target.value === ""
                              ? ""
                              : Number(e.target.value),
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <div className="mb-2">
                  <label>Descripción</label>
                  <textarea
                    className="form-control"
                    value={form.descripcion}
                    onChange={(e) =>
                      setForm({ ...form, descripcion: e.target.value })
                    }
                  />
                </div>

                <div className="d-flex gap-2 mt-3">
                  <button type="submit" className="btn btn-success">
                    {editing ? "Guardar Cambios" : "Crear Producto"}
                  </button>

                  {editing && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setForm(FORM_INICIAL);
                        setEditing(false);
                      }}
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* TABLA */}
          <table className="table table-dark table-hover">
            <thead className="table-success text-dark">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Categoría</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.nombre}</td>
                  <td>{CLP.format(p.precio)}</td>
                  <td>{p.categoria?.nombre || p.categoria?.id}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-info me-2"
                      onClick={() => {
                        setForm({
                          id: p.id,
                          nombre: p.nombre,
                          descripcion: p.descripcion || "",
                          precio: p.precio,
                          categoriaId: p.categoria?.id || 1,
                        });
                        setEditing(true);
                      }}
                    >
                      <FaEdit />
                    </button>

                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => eliminarProducto(p.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
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
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.nombreUsuario}</td>
                <td>{u.email}</td>
                <td>{u.rol}</td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => eliminarUsuario(u.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
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
            {pedidos.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.usuario?.nombreUsuario}</td>
                <td>{p.estado}</td>
                <td>{new Date(p.fechaCreacion).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
