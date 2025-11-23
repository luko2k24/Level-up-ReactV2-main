import React, { FC, useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // Agregamos useNavigate

// ⚠️ ELIMINAMOS importaciones de la DB local:
// import { obtenerProductoPorId, agregarAlCarrito, type Producto } from '../data/db'; 

// 🚀 IMPORTACIONES DE LA NUEVA ARQUITECTURA API
import { api } from '../api/service'; 
import { Producto } from '../types/api'; 
// NOTA: 'nanoid' ya no es necesario aquí
// import { nanoid } from 'nanoid';


export default function ProductoDetalle() {
  // Extrae el 'id' de los parámetros de la URL
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Estados para la API
  const [producto, setProducto] = useState<Producto | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Efecto para cargar el producto de la API
  useEffect(() => {
    if (!id) {
      setError("ID de producto no proporcionado.");
      setLoading(false);
      return;
    }

    const cargarProducto = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const productoId = parseInt(id, 10);
        if (isNaN(productoId)) {
          throw new Error("ID de producto inválido.");
        }

        // 🚀 LLAMADA A LA API: GET /api/v1/productos/{id}
        // Utilizamos el método que ya definimos en el servicio
        const p = await api.Productos.obtenerPorId(productoId);
        setProducto(p);
        
      } catch (err: any) {
        console.error("Error al obtener detalle:", err);
        setError(err.message || "Producto no encontrado o error del servidor.");
        setProducto(undefined); 
      } finally {
        setLoading(false);
      }
    };

    cargarProducto();
  }, [id]);

  // Usamos 'p' como alias para claridad en el JSX, si está cargado
  const p = producto;

  // Función para manejar la adición al carrito
  const handleAddToCart = (producto: Producto) => {
    // ⚠️ LÓGICA MIGRADA: Aquí debes llamar a la función real de tu Hook/Context de carrito
    alert(`Añadiendo ${producto.nombre} (ID: ${producto.id}) al carrito. Usar lógica de useCart.`);
  };
  
  // El campo 'imagen' y 'oferta' no están en el DTO de Spring, los casteamos para no romper la UI
  const imagen = (p as any)?.imagen || 'https://placehold.co/600x400';
  const oferta = (p as any)?.oferta;
  // Accedemos al nombre de la categoría del objeto Producto
  const categoriaNombre = p?.categoria ? p.categoria.nombre : 'Sin Categoría';


  // Manejo del estado de carga y error
  if (loading) {
    return <div className="text-center p-5 text-info">Cargando detalles...</div>;
  }

  // Manejo del estado: Producto no encontrado
  if (!p) {
    return (
      <div className="empty-state text-center p-5 bg-dark rounded-3 shadow-lg text-light">
        <h3 className="fw-light">Producto no encontrado.</h3>
        <p className="text-secondary">Asegúrate de que la URL sea correcta o el producto exista en la base de datos.</p>
        <div className="mt-4">
          <Link className="btn btn-warning btn-lg fw-bold" to="/categorias">Volver a la tienda</Link>
        </div>
      </div>
    );
  }

  // Renderizado normal del producto
  return (
    <>
      {/* Navegación (Breadcrumb simple) */}
      <nav className="breadcrumb-gamer mb-2 small text-light">
        <Link to="/categorias" className="link-warning text-decoration-none">Categorías</Link>
        <span className="sep text-warning mx-2">/</span>
        <span className="text-muted">{categoriaNombre}</span>
      </nav>

      {/* Títulos principales */}
      <h2 className="neon-title text-warning mb-1">{p.nombre}</h2>
      <div className="neon-sub text-muted small mb-4">{categoriaNombre}</div>

      <div className="row g-4">
        {/* IMAGEN 4:3 */}
        <div className="col-12 col-lg-6">
          <div className="panel p-3 bg-dark rounded-3 shadow-lg">
            <div className="ratio ratio-4x3 product-hero overflow-hidden rounded-3">
              <img src={imagen} alt={p.nombre} loading="lazy" className="object-cover w-full h-full" />
            </div>
          </div>
        </div>

        {/* INFO / PRECIO / CTA */}
        <div className="col-12 col-lg-6">
          <div className="panel p-4 bg-dark text-white rounded-3 shadow-lg">
            <div className="d-flex align-items-center gap-2 mb-2">
              {/* Insignias de categoría y oferta */}
              <span className="badge bg-warning text-dark fw-bold">{categoriaNombre}</span>
              {oferta && <span className="badge bg-danger fw-bold">¡Oferta!</span>}
            </div>

            {/* Precio formateado para Chile (CLP) */}
            <h3 className="mb-3 text-warning">${Number(p.precio).toLocaleString('es-CL')}</h3>

            {/* Especificaciones / Listado de información */}
            <ul className="list-unstyled small text-muted mb-4">
              <li>• Garantía 6 meses</li>
              <li>• Despacho a todo Chile</li>
              <li>• Imagen referencial</li>
            </ul>

            {/* Botones de acción */}
            <div className="d-grid gap-2">
              <button
                className="btn btn-warning btn-lg fw-bold"
                onClick={() => handleAddToCart(p)} // Usamos la función tipada
              >
                Agregar al carrito
              </button>
              <Link className="btn btn-outline-light fw-bold" to="/carrito">Ir al carrito</Link>
            </div>
          </div>
        </div>

        {/* DESCRIPCIÓN */}
        <div className="col-12">
          <div className="panel p-4 bg-dark text-white rounded-3 shadow-lg">
            <h5 className="mb-3 text-warning border-bottom border-secondary pb-2">Descripción</h5>
            <p className="text-muted mb-0">
              {p.descripcion}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}