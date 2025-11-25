import React, { FC, useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../api/service/index';
import { Producto } from '../api/api'; 


const NotFoundError = () => (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        {/* Utilizando el estilo .panel de tu tema */}
        <div className="panel p-5 text-center shadow-lg" style={{ maxWidth: '600px', margin: 'auto' }}>
            <h2 className="text-white mb-3">Producto no encontrado.</h2>
            <p className="text-muted mb-4">Asegúrate de que la URL sea correcta o el producto exista en la base de datos.</p>
            <Link className="btn btn-warning fw-bold" to="/categorias">Volver a la tienda</Link>
        </div>
    </div>
);

// --- Componente Principal de Detalle ---
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

  // Usamos 'p' como alias y extraemos info con casteos temporales
  const p = producto;
  // Asume que la URL de la imagen se almacena en una propiedad 'urlImagen' si no está en 'imagen'
  const imagen = (p as any)?.urlImagen || (p as any)?.imagen || 'https://placehold.co/600x400';
  const oferta = (p as any)?.oferta; 
  const categoriaNombre = p?.categoria ? p.categoria.nombre : 'Periféricos';


  // Función para manejar la adición al carrito
  const handleAddToCart = (producto: Producto) => {
    alert(`Añadiendo ${producto.nombre} (ID: ${producto.id}) al carrito. Usar lógica de useCart.`);
  };
  
  // Manejo del estado de carga
  if (loading) {
    return <div className="text-center p-5 text-info">Cargando detalles...</div>;
  }

  // Manejo del estado: Producto no encontrado (Si p es null/undefined)
  if (!p) {
    return <NotFoundError />;
  }

  // --- Renderizado normal del producto ---
  return (
    <div className="container py-5">
      
      {/* 1. HEADER Y BREADCRUMB */}
      <nav className="breadcrumb-gamer mb-2 small text-light">
        <Link to="/categorias" className="link-light text-decoration-none">Categorías</Link>
        <span className="sep mx-2">/</span>
        <span className="text-primary">{categoriaNombre}</span>
      </nav>

      <h1 className="neon-title text-primary mb-1">{p.nombre}</h1>
      <div className="neon-sub text-muted small mb-4">{categoriaNombre}</div>

      <div className="row g-4">
        
        {/* 2. COLUMNA IZQUIERDA: IMAGEN */}
        <div className="col-12 col-lg-6">
          <div className="panel p-3 border-0">
            <div className="ratio ratio-4x3 product-hero overflow-hidden rounded-3">
              <img 
                src={imagen} 
                alt={p.nombre} 
                loading="lazy" 
                className="object-cover w-full h-full" 
              />
            </div>
          </div>
        </div>

        {/* 3. COLUMNA DERECHA: INFO / PRECIO / CTA */}
        <div className="col-12 col-lg-6">
          <div className="panel p-4 shadow-lg h-100 d-flex flex-column justify-content-between">
            
            <div>
              {/* Tags de Categoría y Oferta */}
              <div className="d-flex align-items-center mb-3">
                <span className="badge badge-category me-2 text-uppercase">{categoriaNombre}</span>
                {oferta && <span className="badge badge-oferta text-uppercase">¡Oferta!</span>}
              </div>

              {/* Precio formateado a CLP con tu color primary */}
              <h3 className="text-primary fw-bold display-6 mb-4">
                {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(p.precio)}
              </h3>

              {/* Especificaciones / Listado de información */}
              <ul className="list-unstyled small text-white mb-4">
                <li>• Garantía 6 meses</li>
                <li>• Despacho a todo Chile</li>
                <li>• Imagen referencial</li>
              </ul>
            </div>

            {/* Botones de acción */}
            <div className="d-grid gap-2 mt-auto pt-3">
              {/* Botón Agregar al Carrito (btn-warning de Bootstrap) */}
              <button
                className="btn btn-warning fw-bold btn-lg"
                onClick={() => handleAddToCart(p)}
              >
                Agregar al carrito
              </button>
              
              {/* Botón Ir al Carrito (Neón, usando btn-outline-light para el borde neón) */}
              <Link 
                to="/carrito" 
                className="btn btn-outline-light fw-bold btn-lg"
                style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
              >
                Ir al carrito
              </Link>
            </div>
          </div>
        </div>

        {/* 4. COLUMNA ABAJO: DESCRIPCIÓN (Ocupa el ancho completo) */}
        <div className="col-12 mt-4">
          <div className="panel p-4 shadow-lg">
            <h3 className="neon-title text-primary mb-3">Descripción</h3>
            <p className="text-muted mb-0">
              {p.descripcion || `**${p.nombre}** de la categoría **${categoriaNombre}**. Producto de demostración para la evaluación: catálogo, carrito y checkout con look gamer y Bootstrap.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}