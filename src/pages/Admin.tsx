import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, UsuarioAPI } from "@/api/service";
import { Producto, Pedido } from "@/api/api";
import { getApiErrorMessage } from "@/api/service/error";
import {
  FaBoxOpen,
  FaUsers,
  FaClipboardList,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import "../styles/admin.css";

export default function AdminPanel() {
  const navigate = useNavigate();

  const ROLES_DISPONIBLES = [
    "ROLE_ADMIN",
    "ROLE_VENDEDOR",
    "ROLE_CLIENTE",
    // tolerancia por si el backend acepta/retorna sin prefijo
    "ADMIN",
    "VENDEDOR",
    "CLIENTE",
  ];

  const [activeTab, setActiveTab] =
    useState<"productos" | "usuarios" | "pedidos">("productos");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [productos, setProductos] = useState<Producto[]>([]);
  const [usuarios, setUsuarios] = useState<UsuarioAPI[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editingUserRole, setEditingUserRole] = useState<string>("ROLE_CLIENTE");

  const [togglingOfertaId, setTogglingOfertaId] = useState<number | null>(null);

  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoriaId: "",
    urlImagen: "",
    oferta: false,
  });

  const CLP = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  });

  const normalizeArray = <T,>(data: unknown): T[] =>
    Array.isArray(data) ? (data as T[]) : [];

  const resetProductoForm = () => {
    setNuevoProducto({
      nombre: "",
      descripcion: "",
      precio: "",
      categoriaId: "",
      urlImagen: "",
      oferta: false,
    });
    setEditingProductId(null);
  };

  const startEditUserRole = (u: UsuarioAPI) => {
    setError("");
    setEditingUserId(u.id);
    setEditingUserRole(u.rol || "ROLE_CLIENTE");
  };

  const cancelEditUserRole = () => {
    setEditingUserId(null);
    setEditingUserRole("ROLE_CLIENTE");
  };

  const normalizeRoleForBackend = (role: string): string => {
    // backend espera hasRole('ADMIN') => authority 'ROLE_ADMIN'
    if (!role) return "ROLE_CLIENTE";
    const upper = String(role).toUpperCase();
    if (upper.startsWith("ROLE_")) return upper;
    return `ROLE_${upper}`;
  };

  const guardarRolUsuario = async (id: number) => {
    setError("");
    try {
      await api.Usuarios.actualizarRol(id, normalizeRoleForBackend(editingUserRole));
      cancelEditUserRole();
      await cargarTodo();
    } catch (e) {
      setError(`Cambiar rol: ${getApiErrorMessage(e)}`);
    }
  };

  const cargarTodo = async () => {
    setLoading(true);
    setError("");
    try {
      const [prodRes, userRes, pedRes] = await Promise.allSettled([
        api.Productos.listar(),
        api.Usuarios.listar(),
        api.Pedidos.listar(),
      ]);

      const errores: string[] = [];

      if (prodRes.status === "fulfilled") {
        setProductos(normalizeArray<Producto>(prodRes.value.data));
      } else {
        errores.push(`Productos: ${getApiErrorMessage(prodRes.reason)}`);
        setProductos([]);
      }

      if (userRes.status === "fulfilled") {
        setUsuarios(normalizeArray<UsuarioAPI>(userRes.value.data));
      } else {
        errores.push(`Usuarios: ${getApiErrorMessage(userRes.reason)}`);
        setUsuarios([]);
      }

      if (pedRes.status === "fulfilled") {
        setPedidos(normalizeArray<Pedido>(pedRes.value.data));
      } else {
        errores.push(`Pedidos: ${getApiErrorMessage(pedRes.reason)}`);
        setPedidos([]);
      }

      if (errores.length > 0) {
        setError(errores.join(" | "));
      }
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const guardarProducto = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const precio = Number(nuevoProducto.precio);
    const categoriaId = Number(nuevoProducto.categoriaId);

    if (!nuevoProducto.nombre.trim()) {
      setError("Nombre es requerido");
      return;
    }
    if (!Number.isFinite(precio) || precio <= 0) {
      setError("Precio debe ser un número mayor a 0");
      return;
    }
    if (!Number.isFinite(categoriaId) || categoriaId <= 0) {
      setError("Categoría ID debe ser un número válido");
      return;
    }

    try {
      const payload = {
        nombre: nuevoProducto.nombre,
        descripcion: nuevoProducto.descripcion || undefined,
        precio,
        urlImagen: nuevoProducto.urlImagen || undefined,
        categoria: { id: categoriaId },

        // Nota: id lo maneja el backend
      };

      if (editingProductId != null) {
        await api.Productos.actualizar(editingProductId, payload);

        // Re-sincroniza el producto editado (evita depender del listado completo)
        try {
          const refreshed = await api.Productos.obtenerPorId(editingProductId);
          const updated = refreshed.data;
          setProductos((prev) => prev.map((x) => (x.id === editingProductId ? updated : x)));
        } catch {
          // si falla, recarga todo como fallback
          await cargarTodo();
        }
      } else {
        await api.Productos.crear(payload);
        await cargarTodo();
      }

      resetProductoForm();
    } catch (e) {
      const prefix = editingProductId != null ? "Editar producto" : "Crear producto";
      setError(`${prefix}: ${getApiErrorMessage(e)}`);
    }
  };

  const toggleOfertaProducto = async (p: Producto) => {
    setError("");

    const categoriaId = Number(p.categoria?.id);
    if (!Number.isFinite(categoriaId) || categoriaId <= 0) {
      setError("No se puede cambiar oferta: el producto no tiene categoría válida");
      return;
    }

    setTogglingOfertaId(p.id);
    try {
      const expectedOferta = !Boolean(p.oferta);
      const payload = {
        nombre: p.nombre,
        descripcion: p.descripcion || undefined,
        precio: Number(p.precio),
        oferta: expectedOferta,
        urlImagen: p.urlImagen || undefined,
        categoria: { id: categoriaId },
      };

      await api.Productos.actualizar(p.id, payload);

      // Confirma con el backend (si no persiste el campo, aquí se nota)
      try {
        const refreshed = await api.Productos.obtenerPorId(p.id);
        const updated = refreshed.data;
        setProductos((prev) => prev.map((x) => (x.id === p.id ? updated : x)));

        if (Boolean(updated?.oferta) !== expectedOferta) {
          setError(
            "El backend respondió, pero no está guardando el campo 'oferta'. Revisa que exista en la entidad/DB y en el update del backend."
          );
        }
      } catch {
        await cargarTodo();
      }
    } catch (e) {
      setError(`Cambiar oferta: ${getApiErrorMessage(e)}`);
    } finally {
      setTogglingOfertaId(null);
    }
  };

  const editarProducto = (p: Producto) => {
    setError("");
    setActiveTab("productos");
    setEditingProductId(p.id);
    setNuevoProducto({
      nombre: p.nombre ?? "",
      descripcion: p.descripcion ?? "",
      precio: String(p.precio ?? ""),
      categoriaId: String(p.categoria?.id ?? ""),
      urlImagen: p.urlImagen ?? "",
      oferta: Boolean(p.oferta),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const eliminarProducto = async (id: number) => {
    if (!window.confirm("¿Eliminar este producto?")) return;
    setError("");

    try {
      await api.Productos.eliminar(id);
      await cargarTodo();
    } catch (e) {
      setError(`Eliminar producto: ${getApiErrorMessage(e)}`);
    }
  };

  const eliminarUsuario = async (id: number) => {
    if (!window.confirm("¿Eliminar este usuario?")) return;
    setError("");

    try {
      await api.Usuarios.eliminar(id);
      await cargarTodo();
    } catch (e) {
      setError(`Eliminar usuario: ${getApiErrorMessage(e)}`);
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
    <div className="admin-page container-fluid py-4 min-vh-100">
      <h2 className="neon-title">Panel de Administración</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* TABS */}
      <ul className="admin-tabs nav nav-pills mb-4 gap-2">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "productos" ? "active" : ""}`}
            onClick={() => setActiveTab("productos")}
          >
            <FaBoxOpen /> Productos ({productos.length})
          </button>
        </li>

        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "usuarios" ? "active" : ""}`}
            onClick={() => setActiveTab("usuarios")}
          >
            <FaUsers /> Usuarios ({usuarios.length})
          </button>
        </li>

        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "pedidos" ? "active" : ""}`}
            onClick={() => setActiveTab("pedidos")}
          >
            <FaClipboardList /> Pedidos ({pedidos.length})
          </button>
        </li>
      </ul>

      {/* ================= PRODUCTOS ================= */}
      {activeTab === "productos" && (
        <>
          <div className="panel p-3 mb-4">
            <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
              <h5 className="mb-0">
                {editingProductId != null ? "Editar producto" : "Crear producto"}
              </h5>
              {editingProductId != null && (
                <button
                  type="button"
                  className="btn btn-outline-light btn-sm"
                  onClick={resetProductoForm}
                >
                  Cancelar
                </button>
              )}
            </div>

            <form className="row g-2" onSubmit={guardarProducto}>
              <div className="col-12 col-lg-4">
                <label className="form-label">Nombre</label>
                <input
                  className="form-control"
                  value={nuevoProducto.nombre}
                  onChange={(e) =>
                    setNuevoProducto((p) => ({ ...p, nombre: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="col-12 col-lg-4">
                <label className="form-label">Precio</label>
                <input
                  className="form-control"
                  type="number"
                  min={1}
                  value={nuevoProducto.precio}
                  onChange={(e) =>
                    setNuevoProducto((p) => ({ ...p, precio: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="col-12 col-lg-4">
                <label className="form-label">Categoría ID</label>
                <input
                  className="form-control"
                  type="number"
                  min={1}
                  value={nuevoProducto.categoriaId}
                  onChange={(e) =>
                    setNuevoProducto((p) => ({
                      ...p,
                      categoriaId: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label">Descripción</label>
                <textarea
                  className="form-control"
                  rows={2}
                  value={nuevoProducto.descripcion}
                  onChange={(e) =>
                    setNuevoProducto((p) => ({
                      ...p,
                      descripcion: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="col-12 col-lg-8">
                <label className="form-label">Imagen (nombre de archivo)</label>
                <input
                  className="form-control"
                  value={nuevoProducto.urlImagen}
                  onChange={(e) =>
                    setNuevoProducto((p) => ({
                      ...p,
                      urlImagen: e.target.value,
                    }))
                  }
                  placeholder="ej: mouse.jpg"
                />
              </div>

              <div className="col-12">
                <button className="btn btn-primary fw-bold" type="submit">
                  {editingProductId != null ? "Guardar cambios" : "Crear"}
                </button>
              </div>
            </form>
          </div>

          <div className="panel p-0">
            <div className="admin-section-head">
              <div className="admin-section-title">Productos</div>
              <div className="admin-section-meta">Total: {productos.length}</div>
            </div>

            <table className="admin-table table table-hover mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Categoría</th>
                  <th>Oferta</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {productos.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.nombre}</td>
                    <td>{CLP.format(p.precio)}</td>
                    <td>{p.categoria?.nombre ?? p.categoria?.id}</td>
                    <td>
                      {p.oferta ? (
                        <span className="badge badge-oferta">Sí</span>
                      ) : (
                        <span className="text-muted">No</span>
                      )}
                    </td>
                    <td className="text-end">
                      <div className="admin-actions">
                        <button
                          className={`btn btn-sm ${
                            p.oferta ? "btn-outline-warning" : "btn-outline-success"
                          }`}
                          onClick={() => toggleOfertaProducto(p)}
                          disabled={togglingOfertaId === p.id}
                          title={p.oferta ? "Quitar oferta" : "Poner en oferta"}
                        >
                          {togglingOfertaId === p.id
                            ? "..."
                            : p.oferta
                            ? "Quitar oferta"
                            : "Poner oferta"}
                        </button>
                        <button
                          className="btn btn-sm btn-outline-light"
                          onClick={() => editarProducto(p)}
                          title="Editar"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => eliminarProducto(p.id)}
                          title="Eliminar"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ================= USUARIOS ================= */}
      {activeTab === "usuarios" && (
        <div className="panel p-0">
          <div className="admin-section-head">
            <div className="admin-section-title">Usuarios</div>
            <div className="admin-section-meta">Total: {usuarios.length}</div>
          </div>

          <table className="admin-table table table-hover mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Email</th>
                <th>Rol</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.nombreUsuario}</td>
                  <td>{u.email}</td>
                  <td>
                    {editingUserId === u.id ? (
                      <select
                        className="form-select form-select-sm"
                        value={editingUserRole}
                        onChange={(e) => setEditingUserRole(e.target.value)}
                      >
                        {ROLES_DISPONIBLES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    ) : (
                      u.rol
                    )}
                  </td>
                  <td className="text-end">
                    <div className="admin-actions">
                      {editingUserId === u.id ? (
                        <>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => guardarRolUsuario(u.id)}
                            title="Guardar rol"
                          >
                            Guardar
                          </button>
                          <button
                            className="btn btn-sm btn-outline-light"
                            onClick={cancelEditUserRole}
                            title="Cancelar"
                          >
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <button
                          className="btn btn-sm btn-outline-light"
                          onClick={() => startEditUserRole(u)}
                          title="Editar rol"
                        >
                          Editar
                        </button>
                      )}
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => eliminarUsuario(u.id)}
                        title="Eliminar"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= PEDIDOS ================= */}
      {activeTab === "pedidos" && (
        <div className="panel p-0">
          <div className="admin-section-head">
            <div className="admin-section-title">Pedidos</div>
            <div className="admin-section-meta">Total: {pedidos.length}</div>
          </div>

          <table className="admin-table table table-hover mb-0">
            <thead>
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
        </div>
      )}
    </div>
  );
}
