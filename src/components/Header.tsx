import React, { useState, useEffect, useMemo, FormEvent, ChangeEvent, FC, MouseEvent } from 'react'; // ⬅️ Añadimos MouseEvent
import { Link, NavLink, useNavigate } from 'react-router-dom';
// ⚠️ Descomenta estas líneas o ajusta la ruta si usas un archivo local temporal
// import { ItemCarrito, obtenerCarrito } from '../data/db'; 

// 🚀 IMPORTACIONES DE LA NUEVA ARQUITECTURA API
import { api } from '../api/service'; 
import { Producto } from '../types/api'; 
// NOTA: Asumimos que ItemCarrito es similar o se puede mapear a Producto
type ItemCarrito = Producto & { cantidad: number };

// Función de Carrito de ejemplo (manteniendo temporalmente la simulación o el mapeo local)
const obtenerCarritoSeguro = (): ItemCarrito[] => {
  // ⚠️ Aquí deberías migrar a un Context de Carrito o a Firestore/Redux.
  // Por ahora, devolvemos un array vacío para no depender de la DB local antigua.
  try {
    // Si aún tienes la función local que maneja localStorage:
    // return obtenerCarrito(); 
    return []; // Simulación vacía para demostrar la migración de Auth
  } catch (error) {
    console.error("Error al intentar cargar el carrito:", error);
    return [];
  }
};

// Renombrado de componente (manteniendo la referencia FC)
const Header: FC = () => {
  const [busqueda, setBusqueda] = useState<string>(''); 
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [menuVisible, setMenuVisible] = useState<boolean>(false); 
  const navegar = useNavigate(); 
  
  // 🚀 ESTADOS DE AUTENTICACIÓN REALES
  const [isAuthenticated, setIsAuthenticated] = useState(api.Auth.isAuthenticated());
  const [isAdmin, setIsAdmin] = useState(false); // Inicializamos en false

  useEffect(() => {
    // Verificar el estado de autenticación y el rol al cargar y cada vez que cambia el estado
    const tokenChanged = api.Auth.isAuthenticated();
    setIsAuthenticated(tokenChanged);
    
    // ✅ CORRECCIÓN 1: Llama a isAdmin() de la API (asumiendo que ya fue implementada)
    if (tokenChanged) {
        setIsAdmin(api.Auth.isAdmin()); 
    } else {
        setIsAdmin(false);
    }
    
    // Lógica del Carrito (se deja igual por ahora)
    const c = obtenerCarritoSeguro();
    setCarrito(c);
    
    // Opcional: Escuchar eventos de Storage si el login ocurre en otra pestaña
    const handleStorageChange = () => {
        setIsAuthenticated(api.Auth.isAuthenticated());
        setIsAdmin(api.Auth.isAdmin());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);

  }, [isAuthenticated]); // Dependencia para actualizar si el estado de auth cambia (e.g., después del login/logout)

  // Lógica de cálculo de carrito (sin cambios, usa useMemo)
  const totalCLP = useMemo<string>(() => {
    const total = carrito.reduce((acumulador, item) => {
      const precio = Number(item?.precio) || 0;
      const cantidad = Number(item?.cantidad) || 0;
      return acumulador + precio * cantidad;
    }, 0);
    
    return new Intl.NumberFormat('es-CL', {
      style: 'currency', currency: 'CLP', maximumFractionDigits: 0,
    }).format(total);
  }, [carrito]); 

  const manejarBusqueda = (evento: FormEvent<HTMLFormElement>) => { 
    evento.preventDefault();
    const query = busqueda.trim();
    navegar(`/categorias${query ? `?q=${encodeURIComponent(query)}` : ''}`);
    setBusqueda('');
    setMenuVisible(false); 
  };

  const alternarMenu = () => {
    setMenuVisible(!menuVisible);
  };
  
  // 🚀 FUNCIÓN PARA CERRAR SESIÓN (usa el servicio API)
  // ✅ CORRECCIÓN 2: No necesita ser 'async' ni recibir 'evento' si se usa () => manejarCierreSesion() en el onClick.
  const manejarCierreSesion = () => {
    api.Auth.logout(); // Elimina el token del localStorage
    setIsAuthenticated(false); // Actualiza el estado local
    navegar('/'); // Redirige a la página principal
  }

  const manejarCambioBusqueda = (evento: ChangeEvent<HTMLInputElement>) => {
    setBusqueda(evento.target.value);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-secondary sticky-top shadow-lg">
      <div className="container d-flex align-items-center flex-wrap gap-2">
        {/* Marca */}
        <Link to="/" className="brand-title me-3 text-decoration-none p-1">
          <span className="brand-main fs-4 fw-bold text-white">Level-Up</span> 
          <span className="brand-accent fs-4 fw-light text-success">Gamer</span> 
        </Link>

        {/* Menú hamburguesa */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={alternarMenu}
          aria-controls="navbarNav"
          aria-expanded={menuVisible ? 'true' : 'false'}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menú Principal */} 
        <div className={`collapse navbar-collapse ${menuVisible ? 'show' : ''}`} id="navbarNav">
          <div className="navbar-nav gap-2">
            <NavLink end to="/" className={({ isActive }) => `btn btn-sm ${isActive ? 'btn-outline-success' : 'btn-outline-light'}`}>Inicio</NavLink>
            <NavLink to="/categorias" className={({ isActive }) => `btn btn-sm ${isActive ? 'btn-outline-success' : 'btn-outline-light'}`}>Categorías</NavLink>
            <NavLink to="/ofertas" className={({ isActive }) => `btn btn-sm ${isActive ? 'btn-outline-success' : 'btn-outline-light'}`}>Ofertas</NavLink>

            {/* 🚀 LÓGICA MIGRADA: Mostrar Admin solo si es Admin real (chequeando JWT) */}
            {isAdmin && (
              <NavLink to="/admin" className={({ isActive }) => `btn btn-sm ${isActive ? 'btn-outline-danger' : 'btn-outline-light'}`}>Admin Panel</NavLink>
            )}
          </div>
        </div>

        {/* Buscador y Login/Carrito (alineados a la derecha) */}
        <div className="d-flex align-items-center ms-lg-auto gap-3 flex-grow-1 flex-lg-grow-0">
          <form className="d-flex align-items-center flex-grow-1" onSubmit={manejarBusqueda} role="search">
            <input
              className="form-control form-control-sm me-2"
              type="search"
              placeholder="Buscar productos..."
              value={busqueda}
              onChange={manejarCambioBusqueda}
              style={{ minWidth: '150px' }}
            />
            <button className="btn btn-outline-success btn-sm d-none d-md-block">Buscar</button> 
          </form>
          
          {/* Carrito con ícono (emoji) */}
          <NavLink to="/carrito" className="btn btn-outline-success d-flex align-items-center p-2">
            <span role="img" aria-label="carrito" className="fa-lg">🛒</span> 
            <span className="ms-2 fw-bold text-dark d-none d-sm-inline-block">{totalCLP}</span>
            <span className="ms-2 fw-bold text-dark d-sm-none">{carrito.length}</span>
          </NavLink>

          {/* 🚀 LÓGICA MIGRADA: Login/Logout/Registro */}
          {isAuthenticated ? (
            // Cierre de Sesión para usuario logueado
            <button onClick={manejarCierreSesion} className="btn btn-danger p-2 d-none d-md-block">
              <span role="img" aria-label="logout" className="fa-lg">🚪</span>
            </button>
          ) : (
            // Link a Login para usuario no logueado
            <NavLink to="/login" className="btn btn-outline-light p-2 d-none d-md-block">
              <span role="img" aria-label="login" className="fa-lg">👤</span>
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;