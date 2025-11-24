// src/pages/Checkout.tsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Se asume que estos hooks y tipos están disponibles vía alias @/
import { useCart } from '@/hooks/useCart';
import { api } from '@/api/service'; // Usando la ruta final de tu servicio
import type { ItemCarrito, PedidoRequest, ItemPedidoRequest } from '@/api/api';

// Función utilitaria para formato de moneda (Debería estar en un archivo de utilidades)
const formatearCLP = (valor: number): string => {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        maximumFractionDigits: 0
    }).format(valor);
};


export default function Checkout() {
    // 💡 CORRECCIÓN: Usamos 'total' y lo renombramos a 'totalCLP' para resolver el error.
    const { carrito, vaciar: vaciarCarrito, total: totalCLP } = useCart(); 
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // 5. Check de autenticación y carrito vacío
    if (!api.Auth.isAuthenticated() || carrito.length === 0) {
        return (
            <div className="container my-5 text-center empty-state bg-dark text-light p-5 rounded-3 shadow-lg">
                <h3 className="mb-3">Acceso Denegado o Carrito Vacío</h3>
                <p>Necesitas iniciar sesión y tener productos en tu carrito para proceder al pago.</p>
                <Link to="/login" className="btn btn-primary m-2 fw-bold">Iniciar Sesión</Link>
                <Link to="/productos" className="btn btn-outline-light m-2">Ver Productos</Link>
            </div>
        );
    }
    
    // 1. Mapear los items del carrito al formato que espera el Backend (PedidoRequest)
    const itemsParaAPI: ItemPedidoRequest[] = carrito.map((item: ItemCarrito) => ({
        // El ID del producto se extrae de la estructura anidada.
        producto: { id: item.producto.id }, 
        cantidad: item.cantidad
    }));
    
    // Los datos de dirección/contacto no se envían al DTO Pedido, pero sí se validan en el front.
    const pedidoDataRequest: PedidoRequest = {
        items: itemsParaAPI,
    };
    
    const procesarPedido = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);
        
        try {
            // 2. Llamada a la API: POST /api/v1/pedidos (Requiere Token JWT)
            await api.Pedidos.crearPedido(pedidoDataRequest);

            // 3. Éxito: Limpiar carrito (simulado) y redirigir
            vaciarCarrito();
            navigate('/compra-exitosa');
        } catch (error) {
            console.error('Error al procesar el pedido:', error);
            // 4. Fallo: Redirigir a la página de fallo (ej. token expirado o producto agotado)
            navigate('/compra-fallida');
        } finally {
            setLoading(false); // Desactivar loading
        }
    };
    
    return (
        <div className="container my-5">
            <h2 className="neon-title text-light mb-4">Finalizar Compra</h2>
            
            <form onSubmit={procesarPedido} className="row g-4">
                
                {/* Columna de Checkout (Dirección y Pago) */}
                <div className="col-lg-8">
                    <div className="card bg-dark text-light p-4 shadow-lg">
                        <h4 className="border-bottom pb-2 mb-4">Información de Envío</h4>
                        
                        {/* Campos del formulario (Simulados) */}
                        <div className="mb-3">
                            <label htmlFor="nombre" className="form-label">Nombre Completo</label>
                            <input type="text" id="nombre" className="form-control" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="direccion" className="form-label">Dirección</label>
                            <input type="text" id="direccion" className="form-control" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="ciudad" className="form-label">Ciudad</label>
                            <input type="text" id="ciudad" className="form-control" required />
                        </div>
                        
                        <h4 className="border-bottom pb-2 mt-4 mb-4">Detalles de Pago (Simulado)</h4>
                        <div className="alert alert-warning">
                            El pago es simulado. Solo se enviará el pedido al backend.
                        </div>
                        
                        <button type="submit" className="btn btn-success fw-bold btn-lg mt-3" disabled={loading}>
                            {loading ? 'Procesando...' : 'Confirmar y Pagar'}
                        </button>
                    </div>
                </div>

                {/* Columna de Resumen del Pedido */}
                <div className="col-lg-4">
                    <div className="card bg-secondary-subtle text-light p-4 shadow-lg sticky-top" style={{ top: '90px' }}>
                        <h4 className="border-bottom pb-2 mb-4">Tu Pedido ({carrito.length} Items)</h4>
                        <ul className="list-unstyled">
                            {carrito.map((item: ItemCarrito) => (
                                <li key={item.producto.id} className="d-flex justify-content-between mb-2 small">
                                    <span className="text-truncate me-2" style={{ maxWidth: '60%' }}>
                                        {item.producto.nombre} (x{item.cantidad})
                                    </span>
                                    <span>{formatearCLP(item.producto.precio * item.cantidad)}</span>
                                </li>
                            ))}
                        </ul>
                        
                        <div className="border-top border-secondary pt-3 mt-3">
                            <div className="d-flex justify-content-between fw-bold fs-5">
                                <span>Total a Pagar</span>
                                <span>{formatearCLP(totalCLP)}</span>
                            </div>
                            <Link to="/checkout" className="btn btn-success fw-bold w-100 mt-3">
                                Finalizar Compra
                            </Link>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}