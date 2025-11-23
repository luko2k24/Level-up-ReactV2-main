import { useState, useMemo, FormEvent, ChangeEvent } from 'react';// Agregamos Link
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api/service';
import { PedidoRequest } from '../types/api'; 

// --- Tipos necesarios (debes asegurarte de que tus funciones locales los usen) ---
interface ItemCarrito {
  id: number; // CRÍTICO: ID del Producto (Long en Java)
  nombre: string;
  precio: number;
  cantidad: number;
}
// NOTA: Estas son funciones de sustitución/placeholder para que el código compile.
// Debes reemplazar el cuerpo con las funciones reales de tu hook/context de carrito.
const obtenerCarrito = (): ItemCarrito[] => { /* Implementación de tu carrito real */ return []; };
const totalCarrito = (): number => { /* Implementación del cálculo total */ return 0; };
const vaciarCarrito = (): void => { /* Implementación de vaciar carrito */ };


/** Interfaz que define la estructura de los datos del formulario de checkout. */
interface FormularioDatos {
  nombre: string;
  apellidos: string;
  correo: string;
  calle: string;
  depto: string;
  region: string;
  comuna: string;
  indicaciones: string;
}

/** Interfaz para los mensajes de error del formulario. */
interface ErroresFormulario {
  [key: string]: string | undefined;
  nombre?: string;
  apellidos?: string;
  correo?: string;
  calle?: string;
  region?: string;
  comuna?: string;
}

const estadoInicialFormulario: FormularioDatos = {
  nombre: '',
  apellidos: '',
  correo: '',
  calle: '',
  depto: '',
  region: '',
  comuna: '',
  indicaciones: ''
}

export default function Checkout() {
  const navegar = useNavigate();

  // Obtención de datos del carrito
  const carrito: ItemCarrito[] = obtenerCarrito();
  const total: number = totalCarrito();

  // Estado del formulario y errores
  const [formulario, setFormulario] = useState<FormularioDatos>(estadoInicialFormulario);
  const [errores, setErrores] = useState<ErroresFormulario>({});
  
  // 🚀 NUEVO ESTADO: Para controlar la carga
  const [loading, setLoading] = useState(false);

  // Manejador de cambios en el input (tipado)
  const manejarCambio = (key: keyof FormularioDatos, value: string): void => {
    setFormulario(s => ({ ...s, [key]: value }));
  };

  // Verifica si el carrito está vacío
  const estaVacio: boolean = useMemo(() => carrito.length === 0 || total <= 0, [carrito, total]);

  // Función de validación (tipado)
  const validar = (): boolean => {
    const e: ErroresFormulario = {};
    if (!formulario.nombre.trim()) e.nombre = 'El nombre es obligatorio';
    if (!formulario.apellidos.trim()) e.apellidos = 'Los apellidos son obligatorios';
    // Regex simple de validación de correo
    if (!/^\S+@\S+\.\S+$/.test(formulario.correo)) e.correo = 'El formato del correo es inválido';
    if (!formulario.calle.trim()) e.calle = 'La calle es obligatoria';
    if (!formulario.region.trim()) e.region = 'La región es obligatoria';
    if (!formulario.comuna.trim()) e.comuna = 'La comuna es obligatoria';
    
    setErrores(e);
    return Object.keys(e).length === 0;
  }

  // 🚀 FUNCIÓN MIGRADA: Llama a la API (Asíncrona)
  const enviarFormulario = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (estaVacio) { 
      navegar('/compra-fallida'); 
      return; 
    }
    
    if (!validar()) return;
    
    setLoading(true); // Activar loading
    
    // 1. Mapear los ítems del carrito al formato que espera el Backend (PedidoRequest)
    // El backend solo necesita el ID y la cantidad del producto.
    const itemsParaAPI = carrito.map(item => ({
        // La propiedad se llama 'producto' y debe ser un objeto con 'id'
        producto: { id: item.id }, 
        cantidad: item.cantidad
    }));

    // Los datos de dirección/contacto no se envían al DTO Pedido, pero sí se validan en el front.
    const pedidoData: PedidoRequest = {
      items: itemsParaAPI,
    };
    
    try {
        // 2. Llamada a la API: POST /api/v1/pedidos (Requiere Token JWT)
        await api.Pedidos.crear(pedidoData);

        // 3. Éxito: Limpiar carrito (simulado) y redirigir
        vaciarCarrito();
        navegar('/compra-exitosa');
    } catch (error) {
        console.error("Error al procesar el pedido:", error);
        // 4. Fallo: Redirigir a la página de fallo (ej. token expirado o producto agotado)
        navegar('/compra-fallida');
    } finally {
      setLoading(false); // Desactivar loading
    }
  }
  
  // 5. Check de autenticación: Si el usuario no está logueado, se le impide el checkout
  if (!api.Auth.isAuthenticated()) {
    return (
        <div className="empty-state bg-dark p-5 rounded-3 shadow-lg text-white">
            <div style={{fontSize: 32, marginBottom: 10}}>🚫</div>
            Debes iniciar sesión para completar la compra.
            <Link to="/login" className="btn btn-primary btn-lg mt-3">Iniciar Sesión</Link>
        </div>
    );
  }


  // Renderizar mensaje de carrito vacío (si aplica)
  if (estaVacio){
    return (
      <div className="empty-state bg-dark p-5 rounded-3 shadow-lg text-white">
        <div style={{fontSize: 32, marginBottom: 10}}>🛒</div>
        Tu carrito de compras está **vacío**. 
        <Link to="/categorias" className="btn btn-primary btn-lg mt-3">Ir a comprar</Link>
      </div>
    );
  }

  return (
    <>
      <h2 className="neon-title">Finalizar Compra</h2>

      <div className="row g-4">
        {/* Izquierda: Resumen de compra (tabla) */}
        <div className="col-12 col-lg-6">
          <div className="panel p-4 rounded-3 shadow-lg bg-dark text-white">
            <h5 className="mb-3" style={{color:'var(--primary)'}}>Resumen de la Compra</h5>
            <div className="table-responsive">
              <table className="table align-middle table-dark table-striped">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th className="text-center">Cant.</th>
                    <th className="text-end">Precio U.</th>
                    <th className="text-end">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {carrito.map(i => (
                    <tr key={i.id}>
                      <td className="fw-semibold">{i.nombre}</td>
                      <td className="text-center">{i.cantidad}</td>
                      <td className="text-end">${i.precio.toLocaleString('es-CL')}</td>
                      <td className="text-end fw-bold">${(i.precio * i.cantidad).toLocaleString('es-CL')}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="table-secondary">
                    <td colSpan={3} className="text-end fw-bold text-dark">Total a pagar</td>
                    <td className="text-end fw-bold text-dark">${total.toLocaleString('es-CL')}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Derecha: Formulario (sticky) */}
        <div className="col-12 col-lg-6">
          <div className="panel p-4 rounded-3 shadow-lg bg-dark text-white position-sticky" style={{top:'90px'}}>
            <h5 className="mb-3" style={{color:'var(--primary)'}}>Información y Envío</h5>
            <form className="row g-3" onSubmit={enviarFormulario} noValidate>
              {/* Nombre / Apellidos */}
              <div className="col-md-6">
                <label className="form-label">Nombre*</label>
                <input
                  className={`form-control ${errores.nombre?'is-invalid':''}`}
                  value={formulario.nombre}
                  onChange={(e: ChangeEvent<HTMLInputElement>)=>manejarCambio('nombre', e.target.value)}
                />
                {errores.nombre && <div className="invalid-feedback">{errores.nombre}</div>}
              </div>
              <div className="col-md-6">
                <label className="form-label">Apellidos*</label>
                <input
                  className={`form-control ${errores.apellidos?'is-invalid':''}`}
                  value={formulario.apellidos}
                  onChange={(e: ChangeEvent<HTMLInputElement>)=>manejarCambio('apellidos', e.target.value)}
                />
                {errores.apellidos && <div className="invalid-feedback">{errores.apellidos}</div>}
              </div>

              {/* Correo */}
              <div className="col-12">
                <label className="form-label">Correo Electrónico*</label>
                <input
                  type="email"
                  className={`form-control ${errores.correo?'is-invalid':''}`}
                  value={formulario.correo}
                  onChange={(e: ChangeEvent<HTMLInputElement>)=>manejarCambio('correo', e.target.value)}
                />
                {errores.correo && <div className="invalid-feedback">{errores.correo}</div>}
              </div>

              <h6 className="mt-2" style={{color:'var(--muted)'}}>Dirección de Entrega</h6>

              {/* Calle / Depto */}
              <div className="col-md-8">
                <label className="form-label">Calle y Número*</label>
                <input
                  className={`form-control ${errores.calle?'is-invalid':''}`}
                  value={formulario.calle}
                  onChange={(e: ChangeEvent<HTMLInputElement>)=>manejarCambio('calle', e.target.value)}
                />
                {errores.calle && <div className="invalid-feedback">{errores.calle}</div>}
              </div>
              <div className="col-md-4">
                <label className="form-label">Depto / Casa (Opcional)</label>
                <input
                  className="form-control"
                  value={formulario.depto}
                  onChange={(e: ChangeEvent<HTMLInputElement>)=>manejarCambio('depto', e.target.value)}
                />
              </div>

              {/* Región / Comuna */}
              <div className="col-md-6">
                <label className="form-label">Región*</label>
                <input
                  className={`form-control ${errores.region?'is-invalid':''}`}
                  value={formulario.region}
                  onChange={(e: ChangeEvent<HTMLInputElement>)=>manejarCambio('region', e.target.value)}
                />
                {errores.region && <div className="invalid-feedback">{errores.region}</div>}
              </div>
              <div className="col-md-6">
                <label className="form-label">Comuna*</label>
                <input
                  className={`form-control ${errores.comuna?'is-invalid':''}`}
                  value={formulario.comuna}
                  onChange={(e: ChangeEvent<HTMLInputElement>)=>manejarCambio('comuna', e.target.value)}
                />
                {errores.comuna && <div className="invalid-feedback">{errores.comuna}</div>}
              </div>

              {/* Indicaciones */}
              <div className="col-12">
                <label className="form-label">Indicaciones para el Repartidor (Opcional)</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={formulario.indicaciones}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>)=>manejarCambio('indicaciones', e.target.value)}
                  placeholder="Ej: Entregar a conserjería, código de acceso, tocar tres veces…"
                />
              </div>

              {/* Botón pagar */}
              <div className="col-12 d-grid mt-4">
                <button type="submit" className="btn btn-primary btn-lg fw-bold">
                  Pagar ahora ${total.toLocaleString('es-CL')}
                </button>
              </div>
              <p className="small text-muted mt-1">Los campos con * son obligatorios para el envío.</p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}