import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { Producto } from '@/api/api'; 
// Asume que Producto es el tipo ProductoAPI que definiste en db.ts

// --- Variables de Fallback (Asegurando rutas estables) ---
const FALLBACK = '/img/productos/placeholder.png';

// --- Definición de Tipos ---
interface TarjetaProductoProps {
    producto: Producto | null;
    onAdd?: (producto: Producto) => void;
    onView?: () => void;
}

const ProductCard: FC<TarjetaProductoProps> = ({ producto, onAdd, onView }) => {
    if (!producto) return null;

    // Destructuramos las propiedades clave
    const { id, nombre, precio, categoria } = producto; 
    
    // Usamos el campo 'urlImagen' que tu API devuelve
    const urlImagen = (producto as any).urlImagen; 
    const oferta = producto.oferta; 

    // CORRECCIÓN CLAVE: La URL de imagen
    const finalImageUrl = urlImagen ? `/${urlImagen}` : FALLBACK; 

    // Tipado para el evento onError de la imagen
    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        (e.currentTarget as HTMLImageElement).src = FALLBACK;
    };

    // Lógica para decidir el enlace
    // Usamos el Link si onView no se proporciona (comportamiento por defecto)
    const isViewLink = id && onView === undefined;
    
    // Formateo del precio a CLP
    const precioFormateado = Number(precio).toLocaleString('es-CL', {
        style: 'currency',
        currency: 'CLP',
        maximumFractionDigits: 0
    });

    return (
        <div className="card h-100 shadow-sm border-0 bg-dark text-white">
            {/* Marco UNIFORME: 4:3 */}
            <div className="ratio ratio-4x3 product-media overflow-hidden rounded-top" style={{ backgroundColor: '#1e1e1e' }}>
                <img
                    src={finalImageUrl}
                    onError={handleError} 
                    loading="lazy"
                    alt={nombre}
                    className="object-fit-cover w-100 h-100"
                />
            </div>

            <div className="card-body d-flex flex-column p-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    {/* Insignia de categoría */}
                    {categoria && categoria.nombre && <span className="badge badge-category text-uppercase fw-normal">{categoria.nombre}</span>}
                    {oferta && <span className="badge badge-oferta text-uppercase fw-bold">¡Oferta!</span>}
                </div>
            
                <h5 className="card-title text-truncate mb-1">{nombre}</h5>
                
                {categoria && categoria.nombre && <p className="card-text text-muted small">{categoria.nombre}</p>}
                
                <p className="fs-4 fw-bold text-success mb-3 mt-auto">{precioFormateado}</p>

                <div className="d-flex gap-2">
                    {/* Botón Ver Detalle */}
                    {isViewLink ? (
                        // 🚨 RUTA CRÍTICA: /productos/ID (Asegura que tu App.tsx use el plural)
                        <Link 
                            to={`/productos/${id}`} 
                            className="btn btn-outline-light btn-sm flex-grow-1"
                        >
                            Ver Detalle
                        </Link>
                    ) : (
                        <button 
                            className="btn btn-outline-light btn-sm flex-grow-1" 
                            onClick={onView}
                            disabled={!onView && !id} 
                        >
                            Ver Detalle
                        </button>
                    )}
                
                    {/* Botón Agregar al Carrito */}
                    <button 
                        className="btn btn-warning btn-sm flex-grow-1" 
                        onClick={() => onAdd && onAdd(producto)}
                        disabled={!onAdd} 
                    >
                        Agregar al Carrito
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;