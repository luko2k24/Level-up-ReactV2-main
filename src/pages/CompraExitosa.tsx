import React, { JSX } from 'react'
import { Link, useLocation } from 'react-router-dom' 

// 1. Define la interfaz para el estado que se pasa a través de la ruta.
interface EstadoRutaCompra {
  monto: number;
}

export default function CompraExitosa(): JSX.Element {

  const loc = useLocation();
  const estado = loc.state as EstadoRutaCompra | null;
  const monto = estado?.monto ?? 0;

  return (
    <div className="text-center">
      <h1>¡Compra realizada con éxito! 🎉</h1>
      {/* Usamos toLocaleString para formatear el número como moneda chilena (es-CL) */}
      <p className="lead">Monto pagado: ${monto.toLocaleString('es-CL')}</p>
      <Link to="/" className="btn btn-primary mt-3">Volver a la tienda</Link>
    </div>
  )
}