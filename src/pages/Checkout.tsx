import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import type { ItemCarrito } from "@/api/api";

const formatearCLP = (valor: number): string =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0
  }).format(valor);

export default function Checkout() {
  const { carrito, vaciar: vaciarCarrito, total: totalCLP } = useCart();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [nombreCompleto, setNombreCompleto] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ciudad, setCiudad] = useState("");

  if (carrito.length === 0) {
    return (
      <div className="container text-center text-light my-5">
        <h3>Tu carrito está vacío</h3>
        <Link to="/productos" className="btn btn-primary mt-3">
          Ver productos
        </Link>
      </div>
    );
  }

  const procesarPedido = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const pedidoBody = {
        nombreCompleto,
        direccion,
        ciudad,
        total: totalCLP,
        items: carrito.map((item: ItemCarrito) => ({
          cantidad: item.cantidad,
          producto: { id: item.producto.id }
        }))
      };

      const response = await fetch(
        "http://localhost:8080/api/v1/pedidos/publico",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(pedidoBody)
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error backend:", errorText);
        throw new Error("Error al crear pedido");
      }

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

            <div className="mb-3">
              <label className="form-label">Nombre Completo</label>
              <input
                required
                className="form-control"
                value={nombreCompleto}
                onChange={(e) => setNombreCompleto(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Dirección</label>
              <input
                required
                className="form-control"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Ciudad</label>
              <input
                required
                className="form-control"
                value={ciudad}
                onChange={(e) => setCiudad(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-success w-100 fw-bold btn-lg mt-3"
              disabled={loading}
            >
              {loading ? "Procesando pedido..." : "Confirmar y Pagar"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
