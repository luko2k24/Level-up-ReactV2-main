import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { crearOrden } from "@/api/service/ordenes";
import { useAuthToken } from "@/hooks/useAuth";
import type { ItemCarrito } from "@/api/api";

const formatearCLP = (valor: number): string =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(valor);

export default function Checkout() {
  const { carrito, vaciar: vaciarCarrito, total: totalCLP } = useCart();
  const navigate = useNavigate();

  const token = useAuthToken() ?? localStorage.getItem("token");
  const [loading, setLoading] = useState(false);

  if (carrito.length === 0 || !token) {
    return (
      <div className="container text-center text-light my-5">
        <h3>{carrito.length === 0 ? "Tu carrito está vacío" : "Debes iniciar sesión para comprar"}</h3>
        <Link to={carrito.length === 0 ? "/productos" : "/login"} className="btn btn-primary mt-3">
          {carrito.length === 0 ? "Ver productos" : "Iniciar Sesión"}
        </Link>
      </div>
    );
  }

  const procesarPedido = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      // ✅ Transformación correcta para el backend
      const pedidoBody = {
        items: carrito.map((item: ItemCarrito) => ({
          cantidad: item.cantidad,
          producto: { id: item.producto.id }
        }))
      };

      await crearOrden(pedidoBody, token);
      vaciarCarrito();
      navigate("/compra-exitosa");
    } catch (error) {
      console.error("ERROR EN ENVÍO:", error);
      navigate("/compra-fallida");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-light mb-4">Finalizar Compra</h2>
      <form onSubmit={procesarPedido} className="row g-4">
        <div className="col-lg-8">
          <div className="card bg-dark text-light p-4 shadow-lg">
            <h4 className="border-bottom pb-2 mb-4">Información de Envío</h4>
            <div className="mb-3"><label className="form-label">Nombre Completo</label><input required className="form-control" /></div>
            <div className="mb-3"><label className="form-label">Dirección</label><input required className="form-control" /></div>
            <div className="mb-3"><label className="form-label">Ciudad</label><input required className="form-control" /></div>

            <h4 className="border-bottom pb-2 mt-4 mb-4">Detalle de Pago</h4>
            <div className="alert alert-warning">El pago es simulado. Solo se registrará el pedido.</div>

            <button type="submit" className="btn btn-success w-100 fw-bold btn-lg mt-3" disabled={loading}>
              {loading ? "Procesando pedido..." : "Confirmar y Pagar"}
            </button>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card bg-secondary-subtle text-light p-4 shadow-lg sticky-top" style={{ top: "90px" }}>
            <h4 className="border-bottom pb-2 mb-4">
              Tu Pedido ({carrito.length} productos)
            </h4>
            <ul className="list-unstyled">
              {carrito.map((item: ItemCarrito, i: number) => (
                <li key={i} className="d-flex justify-content-between small mb-2">
                  <span>{item.producto.nombre} x{item.cantidad}</span>
                  <span>{formatearCLP(item.producto.precio * item.cantidad)}</span>
                </li>
              ))}
            </ul>
            <hr className="border-top border-secondary pt-3 mt-3 d-flex justify-content-between fs-5 fw-bold" />
            <div className="d-flex justify-content-between fw-bold">
              <div>Total</div>
              <div>{formatearCLP(totalCLP || 0)}</div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
