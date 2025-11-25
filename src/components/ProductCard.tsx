// src/components/ProductCard.tsx

import React, { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { Producto } from '../api/api';

const FALLBACK = '/img/productos/placeholder.png';

interface TarjetaProductoProps {
    producto: Producto | null;
    onAdd?: (producto: Producto) => void;   
    onView?: () => void;
}

const ProductCard: FC<TarjetaProductoProps> = ({ producto, onAdd, onView }) => {

    const [cargando, setCargando] = useState(false);

    if (!producto) return null;

    const { id, nombre, precio, categoria } = producto;
    const urlImagen = (producto as any).urlImagen;
    const oferta = producto.oferta;

    const finalImageUrl = urlImagen ? `/${urlImagen}` : FALLBACK;

    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        (e.currentTarget as HTMLImageElement).src = FALLBACK;
    };

    const precioFormateado = Number(precio).toLocaleString('es-CL', {
        style: 'currency',
        currency: 'CLP',
        maximumFractionDigits: 0
    });

    // Función segura para agregar al carrito
    const handleAddToCartClick = async () => {
        if (!onAdd || cargando) return;

        setCargando(true);
        try {
            onAdd(producto); 
        } catch (error) {
            console.error("Error agregando al carrito:", error);
        } finally {
            setCargando(false);
        }
    };

    const isViewLink = id && onView === undefined;

    return (
        <div className="card h-100 shadow-sm border-0 bg-dark text-white">

            <div className="ratio ratio-4x3 product-media overflow-hidden rounded-top" style={{ backgroundColor: '#1e1e1e' }}>
                <img
                    src={finalImageUrl}
                    alt={nombre}
                    onError={handleError}
                    loading="lazy"
                    className="object-fit-cover w-100 h-100"
                />
            </div>

            <div className="card-body d-flex flex-column p-3">

                <div className="d-flex justify-content-between align-items-center mb-2">
                    {categoria && categoria.nombre && (
                        <span className="badge badge-category text-uppercase fw-normal">
                            {categoria.nombre}
                        </span>
                    )}
                    {oferta && <span className="badge badge-oferta fw-bold">¡Oferta!</span>}
                </div>

                <h5 className="card-title text-truncate mb-1">{nombre}</h5>
                <p className="text-muted small">{categoria?.nombre ?? ''}</p>

                <p className="fs-4 fw-bold text-success mb-3 mt-auto">{precioFormateado}</p>

                <div className="d-flex gap-2">

                    {isViewLink ? (
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
                        >
                            Ver Detalle
                        </button>
                    )}

                    <button
                        className="btn btn-warning btn-sm flex-grow-1"
                        onClick={handleAddToCartClick}
                        disabled={cargando}
                    >
                        {cargando ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Agregando...
                            </>
                        ) : 'Agregar al Carrito'}
                    </button>

                </div>
            </div>
        </div>
    );
};

export default ProductCard;
