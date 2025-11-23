// src/components/ProductCard.tsx

import React, { FC, MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { Producto } from '../types/api';

// --- 1. Definición de Tipos ---

// La interfaz espera 'producto' (en español) para coincidir con Home.tsx
interface TarjetaProductoProps {
    producto?: Producto | null; 
    onAdd?: (producto: Producto) => void;
    onView?: () => void;
}

const FALLBACK = 'https://placehold.co/400x300/1C2833/FFFFFF?text=Sin+Imagen';

// Definimos el componente como Functional Component (FC) con sus props tipados
const ProductCard: FC<TarjetaProductoProps> = ({ producto, onAdd, onView }) => {
    // Si no hay producto, retornamos null inmediatamente
    if (!producto) return null;

    // Destructuramos las propiedades del producto
    const { id, nombre, precio, categoria } = producto as any; 
    const imagen = (producto as any).imagen; 
    const oferta = (producto as any).oferta; 

    // Tipado para el evento onError de la imagen
    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        (e.currentTarget as HTMLImageElement).src = FALLBACK;
    };

    // Usamos un botón para 'Ver' si el ID no existe (solo si onView existe)
    const isViewLink = id && onView === undefined;
    
    // Convertimos el precio a number antes de formatear
    const precioFormateado = Number(precio).toLocaleString('es-CL', {
        style: 'currency',
        currency: 'CLP',
        maximumFractionDigits: 0
    });

    return (
        <div className="card h-100 shadow-sm border-0 bg-dark text-white">
            {/* Marco UNIFORME: 4:3, centrado, sin recorte */}
            <div className="ratio ratio-4x3 product-media overflow-hidden rounded-top" style={{ backgroundColor: '#1e1e1e' }}>
                <img
                    src={imagen || FALLBACK}
                    onError={handleError} 
                    loading="lazy"
                    alt={nombre}
                    className="object-fit-cover w-100 h-100"
                />
            </div>

            <div className="card-body d-flex flex-column p-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    {/* Accedemos a categoria.nombre (si existe) */}
                    {categoria && categoria.nombre && <span className="badge bg-secondary text-uppercase fw-normal">{categoria.nombre}</span>}
                    {oferta && <span className="badge bg-danger text-uppercase fw-bold">¡Oferta!</span>}
                </div>
            
                <h5 className="card-title text-truncate mb-1">{nombre}</h5>
                {/* Accedemos a categoria.nombre para el texto */}
                {categoria && categoria.nombre && <p className="card-text text-muted small">{categoria.nombre}</p>}
                
                {/* Usamos la variable formateada */}
                <p className="fs-4 fw-bold text-success mb-3 mt-auto">{precioFormateado}</p>

                <div className="d-flex gap-2">
                    {/* Lógica para decidir si es Link o Button */}
                    {isViewLink ? (
                        <Link to={`/producto/${id}`} className="btn btn-outline-light btn-sm flex-grow-1">Ver Detalle</Link>
                    ) : (
                        <button 
                            className="btn btn-outline-light btn-sm flex-grow-1" 
                            onClick={onView}
                            disabled={!onView && !id} 
                        >
                            Ver Detalle
                        </button>
                    )}
                
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