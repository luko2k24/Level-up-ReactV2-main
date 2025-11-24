// src/pages/Carrito.tsx

import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
// Se asume que estos tipos y hooks están en la ruta @/
import type { ItemCarrito } from '@/api/api'; 
import { useCart } from '@/hooks/useCart';

// --- FUNCIONES AUXILIARES (ASUMIDAS) ---

// Función utilitaria para formato de moneda (CLP)
const formatearCLP = (valor: number): string => {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        maximumFractionDigits: 0
    }).format(valor);
};

// --- COMPONENTE PRINCIPAL ---

export default function Carrito() {
    // 1. Obtener funciones y estado del hook de carrito
    const { 
        carrito, 
        eliminar: eliminarDelCarrito, // Función del hook (espera string)
        vaciar: vaciarCarrito,
        total: totalCLP // 💡 CORRECCIÓN: Alias 'total' a 'totalCLP' para resolver el error
    } = useCart();


    // 2. Función local para manejar la eliminación (usa el hook)
    // 💡 CORRECCIÓN DE TIPO: Aceptamos string para coincidir con el tipado del hook
    const eliminar = (productoId: string) => { 
        if (window.confirm("¿Está seguro de eliminar este producto del carrito?")) {
            eliminarDelCarrito(productoId);
        }
    };
    
    // Función local para vaciar el carrito
    const vaciar = () => {
        if (window.confirm('¿Está seguro de vaciar todo el carrito?')) {
            vaciarCarrito();
        }
    }
    
    // 3. Manejo de carrito vacío
    if (carrito.length === 0) {
        return (
            <div className="container my-5 text-center text-light">
                <h2 className="mb-4">Tu carrito de compras está vacío</h2>
                <p className="text-secondary">Añade algunos productos para empezar tu pedido.</p>
                <Link to="/productos" className="btn btn-primary mt-3 fw-bold">
                    Volver a la tienda
                </Link>
            </div>
        );
    }
    
    // 4. Renderizado del carrito (con correcciones de acceso a producto)
    return (
        <div className="container my-5">
            <h2 className="neon-title text-light mb-4">Tu Carrito de Compras</h2>
            
            <div className="row">
                
                {/* Columna principal del Carrito (Tabla) */}
                <div className="col-12 col-lg-8">
                    <table className="table table-dark table-hover align-middle">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Cantidad</th>
                                <th>Precio Unit.</th>
                                <th>Subtotal</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {carrito.map((i: ItemCarrito) => (
                                <tr key={i.producto.id}> 
                                    <td>
                                        <span className="fw-semibold text-light">{i.producto.nombre}</span>
                                    </td>
                                    <td>{i.cantidad}</td>
                                    <td>{formatearCLP(i.producto.precio)}</td>
                                    <td>{formatearCLP(i.producto.precio * i.cantidad)}</td>
                                    <td>
                                        <button 
                                            className="btn btn-sm btn-outline-danger fw-bold"
                                            // 💡 CORRECCIÓN: Conversión a string para la función 'eliminar'
                                            onClick={() => eliminar(String(i.producto.id))} 
                                        >
                                            <i className="fa fa-times"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="d-flex justify-content-between flex-wrap gap-2 pt-3 border-top border-secondary">
                        <button className="btn btn-outline-danger fw-bold" onClick={vaciar}>Vaciar carrito</button>
                        <Link to="/checkout" className="btn btn-outline-warning fw-bold">Seguir comprando</Link>
                    </div>
                </div>

                {/* Columna de Resumen de Compra */}
                <div className="col-12 col-lg-4">
                    <div className="bg-secondary-subtle p-4 text-light rounded-3 shadow-lg sticky-top" style={{ top: '90px' }}>
                        <h3 className="h5 fw-bold border-bottom border-secondary pb-2">Resumen de Compra</h3>
                        
                        <ul className="list-unstyled summary-list">
                            {carrito.map((i: ItemCarrito) => (
                                <li 
                                    key={i.producto.id} 
                                    className="d-flex justify-content-between content-between small mb-2 text-secondary"
                                >
                                    <span className="text-truncate me-2" style={{ maxWidth: '70%' }}>
                                        {i.producto.nombre} 
                                    </span>
                                    <span className="fw-bold text-light">
                                        {formatearCLP(i.producto.precio * i.cantidad)} 
                                    </span>
                                </li>
                            ))}
                        </ul>
                        
                        <div className="border-top border-secondary pt-3 mt-3">
                            <div className="d-flex justify-content-between fw-bold fs-5">
                                <span>Total</span>
                                <span>{formatearCLP(totalCLP)}</span>
                            </div>
                            <Link to="/checkout" className="btn btn-success fw-bold w-100 mt-3">
                                Finalizar Compra
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}