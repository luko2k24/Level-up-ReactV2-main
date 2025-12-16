import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "@/api/service";
import { Producto } from "@/api/api";
import { normalizarProducto } from "@/utils/normalizarProducto";

const FALLBACK_IMAGE = "/img/productos/placeholder.png";

// ---------------- NOT FOUND ----------------
const NotFoundError = () => (
  <div
    className="d-flex justify-content-center align-items-center"
    style={{ minHeight: "60vh" }}
  >
    <div className="panel p-5 text-center shadow-lg" style={{ maxWidth: 600 }}>
      <h2 className="text-white mb-3">Producto no encontrado</h2>
      <p className="text-muted mb-4">
        El producto no existe o fue eliminado.
      </p>
      <Link className="btn btn-warning fw-bold" to="/categorias">
        Volver a la tienda
      </Link>
    </div>
  </div>
);

// ---------------- COMPONENTE ----------------
export default function ProductoDetalle() {
  const { id } = useParams<{ id: string }>();

  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);

  // ---------------- CARGA PRODUCTO ----------------
  useEffect(() => {
    if (!id) return;

    const cargarProducto = async () => {
      try {
        setLoading(true);

        // Axios devuelve { data }
        const res = await api.Productos.obtenerPorId(Number(id));

        // Normalizamos el producto
        const productoNormalizado = normalizarProducto(res.data);

        setProducto(productoNormalizado);
      } catch (error) {
        console.error("Error cargando producto:", error);
        setProducto(null);
      } finally {
        setLoading(false);
      }
    };

    cargarProducto();
  }, [id]);

  // ---------------- ESTADOS ----------------
  if (loading) {
    return (
      <div className="text-center p-5 text-info">
        Cargando detalles...
      </div>
    );
  }

  if (!producto) {
    return <NotFoundError />;
  }

  // ---------------- RENDER ----------------
  return (
    <div className="container py-5">
      {/* BREADCRUMB */}
      <nav className="breadcrumb-gamer mb-2 small text-light">
        <Link to="/categorias" className="link-light text-decoration-none">
          Categorías
        </Link>
        <span className="mx-2">/</span>
        <span className="text-primary">
          {producto.categoria.nombre}
        </span>
      </nav>

      <h1 className="neon-title text-primary mb-1">
        {producto.nombre}
      </h1>

      <div className="neon-sub text-muted small mb-4">
        {producto.categoria.nombre}
      </div>

      <div className="row g-4">
        {/* IMAGEN */}
        <div className="col-12 col-lg-6">
          <div className="panel p-3">
            <div className="ratio ratio-4x3 overflow-hidden rounded-3">
              <img
                src={
                  producto.urlImagen
                    ? `/img/productos/${producto.urlImagen}`
                    : FALLBACK_IMAGE
                }
                alt={producto.nombre}
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_IMAGE;
                }}
                className="object-fit-cover w-100 h-100"
              />
            </div>
          </div>
        </div>

        {/* INFO */}
        <div className="col-12 col-lg-6">
          <div className="panel p-4 shadow-lg h-100 d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex align-items-center mb-3">
                <span className="badge badge-category me-2 text-uppercase">
                  {producto.categoria.nombre}
                </span>

                {producto.oferta && (
                  <span className="badge badge-oferta">
                    ¡Oferta!
                  </span>
                )}
              </div>

              <h3 className="text-primary fw-bold display-6 mb-4">
                {new Intl.NumberFormat("es-CL", {
                  style: "currency",
                  currency: "CLP",
                  maximumFractionDigits: 0,
                }).format(producto.precio)}
              </h3>

              <ul className="list-unstyled small text-white mb-4">
                <li>• Garantía 6 meses</li>
                <li>• Despacho a todo Chile</li>
                <li>• Imagen referencial</li>
              </ul>
            </div>

            <div className="d-grid gap-2 mt-auto pt-3">
              <button className="btn btn-warning fw-bold btn-lg">
                Agregar al carrito
              </button>

              <Link
                to="/carrito"
                className="btn btn-outline-light fw-bold btn-lg"
                style={{
                  borderColor: "var(--primary)",
                  color: "var(--primary)",
                }}
              >
                Ir al carrito
              </Link>
            </div>
          </div>
        </div>

        {/* DESCRIPCIÓN */}
        <div className="col-12 mt-4">
          <div className="panel p-4 shadow-lg">
            <h3 className="neon-title text-primary mb-3">
              Descripción
            </h3>
            <p className="text-muted mb-0">
              {producto.descripcion || "Sin descripción disponible."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
