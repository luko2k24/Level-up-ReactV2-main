import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, UsuarioAPI } from "@/api/service";
import { Producto, Pedido } from "@/api/api";
import { getApiErrorMessage } from "@/api/service/error";
import {
  FaBoxOpen,
  FaUsers,
  FaClipboardList,
  FaTrash,
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

  const crearProducto = async (e: React.FormEvent) => {
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
      await api.Productos.crear({
        nombre: nuevoProducto.nombre,
        descripcion: nuevoProducto.descripcion || undefined,
        precio,
        oferta: Boolean(nuevoProducto.oferta),
        urlImagen: nuevoProducto.urlImagen || undefined,
        categoria: { id: categoriaId },
      });

      setNuevoProducto({
        nombre: "",
        descripcion: "",
        precio: "",
        categoriaId: "",
        urlImagen: "",
        oferta: false,
      });

      await cargarTodo();
    } catch (e) {
      setError(`Crear producto: ${getApiErrorMessage(e)}`);
    }
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
        <>
          <div className="panel p-3 mb-4">
            <h5 className="mb-3">Crear producto</h5>

            <form className="row g-2" onSubmit={crearProducto}>
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

              <div className="col-12 col-lg-4 d-flex align-items-end">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={nuevoProducto.oferta}
                    onChange={(e) =>
                      setNuevoProducto((p) => ({
                        ...p,
                        oferta: e.target.checked,
                      }))
                    }
                    id="oferta"
                  />
                  <label className="form-check-label" htmlFor="oferta">
                    Oferta
                  </label>
                </div>
              </div>

              <div className="col-12">
                <button className="btn btn-success fw-bold" type="submit">
                  Crear
                </button>
              </div>
            </form>
          </div>

          <table className="table table-dark table-hover">
            <thead className="table-success text-dark">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Categoría</th>
                <th style={{ width: 90 }}></th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.nombre}</td>
                  <td>{CLP.format(p.precio)}</td>
                  <td>{p.categoria?.nombre ?? p.categoria?.id}</td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => eliminarProducto(p.id)}
                      title="Eliminar"
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
              <th style={{ width: 90 }}></th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.nombreUsuario}</td>
                <td>{u.email}</td>
                <td>{u.rol}</td>
                <td className="text-end">
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => eliminarUsuario(u.id)}
                    title="Eliminar"
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
