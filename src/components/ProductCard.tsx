// src/components/ProductCard.tsx
import React, { FC, useState } from "react";
import { Link } from "react-router-dom";
import { ProductoNormalizado } from "@/utils/normalizarProducto";

const FALLBACK = "/img/productos/placeholder.png";

interface TarjetaProductoProps {
  producto: ProductoNormalizado;
  onAdd?: (producto: ProductoNormalizado) => void; // ✅ FIX
}

const ProductCard: FC<TarjetaProductoProps> = ({ producto, onAdd }) => {
  const [cargando, setCargando] = useState(false);

  const { id, nombre, precio, categoria, oferta, urlImagen } = producto;

  const imagen = urlImagen || FALLBACK;

  const precioFormateado = Number(precio).toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  });

  const handleAddToCartClick = () => {
    if (!onAdd || cargando) return;
    setCargando(true);
    onAdd(producto);
    setCargando(false);
  };

  return (
    <div className="card h-100 bg-dark text-white border-0 shadow">
      {/* IMAGEN */}
      <div className="ratio ratio-4x3 overflow-hidden rounded-top">
        <img
          src={imagen}
          alt={nombre}
          onError={(e) => (e.currentTarget.src = FALLBACK)}
          className="object-fit-cover w-100 h-100"
        />
      </div>

      {/* BODY */}
      <div className="card-body d-flex flex-column">
        <span className="badge bg-success mb-2 text-uppercase">
          {categoria.nombre}
        </span>

        {oferta && (
          <span className="badge badge-oferta align-self-start mb-2">
            ¡Oferta!
          </span>
        )}

        <h5 className="text-truncate">{nombre}</h5>

        <p className="fs-4 fw-bold text-success mt-auto">
          {precioFormateado}
        </p>

        <div className="d-flex gap-2 mt-2">
          <Link
            to={`/productos/${id}`}
            className="btn btn-outline-light btn-sm w-50"
          >
            Ver Detalle
          </Link>

          <button
            className="btn btn-warning btn-sm w-50"
            onClick={handleAddToCartClick}
            disabled={cargando}
          >
            {cargando ? "Agregando..." : "Agregar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
