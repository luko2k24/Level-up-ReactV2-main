import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { api } from '@/api/service'; 
import { FaSearch, FaShoppingCart, FaUserCircle, FaSignInAlt, FaUserShield, FaSignOutAlt } from 'react-icons/fa';

export default function Header() {
    const navigate = useNavigate();
    const location = useLocation();

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    // Efecto para verificar autenticación
    useEffect(() => {
        const checkAuth = () => {
            const isAuth = api.Auth.isAuthenticated();
            setIsAuthenticated(isAuth); // Si esto es false, muestra Login. Si es true, muestra Perfil.
            
            if (isAuth) {
                setIsAdmin(api.Auth.isAnAdmin());
            } else {
                setIsAdmin(false);
            }
        };

        checkAuth();

        // Escuchar cambios (login/logout)
        const handleStorageChange = () => checkAuth();
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    },[location.pathname]);

    // --- ESTILOS CORREGIDOS ---
    // En lugar de usar botones con borde que se ponen blancos, usamos texto y efectos hover
    const getLinkClasses = (path: string) => {
        const isActive = location.pathname === path;
        // Si está activo: Texto Verde Brillante y negrita
        // Si no: Texto Blanco
        return `nav-link px-3 mx-1 fw-bold transition-all ${isActive ? 'text-success border-bottom border-success' : 'text-white opacity-75 hover-opacity-100'}`;
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-lg" style={{ borderBottom: '1px solid #2c2c2c' }}>
            <div className="container-fluid px-4"> 
                
                {/* LOGO */}
                <Link to="/" className="navbar-brand me-5 d-flex align-items-center fw-bold fs-3 text-white" style={{ letterSpacing: '-1px' }}>
                    <span className="text-success me-1">Level-Up</span>Gamer
                </Link>
                
                {/* Toggle Móvil */}
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Contenido Principal */}
                <div className="collapse navbar-collapse" id="navbarNav">
                    
                    {/* Links de Navegación (Centrados o Izquierda) */}
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0"> 
                        <li className="nav-item">
                            <Link className={getLinkClasses('/')} to="/">Inicio</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={getLinkClasses('/categorias')} to="/categorias">Categorías</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={getLinkClasses('/ofertas')} to="/ofertas">Ofertas</Link>
                        </li>
                    </ul>

                    {/* Bloque Derecha: Buscador + Acciones */}
                    <div className="d-flex flex-column flex-lg-row align-items-center gap-3"> 
                        
                        {/* Buscador */}
                        <form className="d-flex" role="search">
                            <div className="input-group">
                                <input 
                                    className="form-control bg-dark text-white border-secondary" 
                                    type="search" 
                                    placeholder="Buscar..." 
                                    aria-label="Search"
                                    style={{ minWidth: '250px' }}
                                />
                                <button className="btn btn-outline-secondary text-success" type="submit">
                                    <FaSearch />
                                </button>
                            </div>
                        </form>
                        
                        {/* Acciones */}
                        <div className="d-flex align-items-center gap-2">
                            
                            {/* Carrito */}
                            <Link to="/carrito" className="btn btn-dark d-flex align-items-center gap-2 border border-secondary text-light hover-success">
                                <FaShoppingCart className="text-success"/>
                                <span>Carrito</span>
                            </Link>
                            
                            {/* Lógica Login / Perfil */}
                            {isAuthenticated ? (
                                // SI ESTÁ LOGUEADO: Muestra Admin (si corresponde) y Perfil
                                <div className="d-flex gap-2">
                                    {isAdmin && (
                                        <Link to="/admin" className="btn btn-warning fw-bold d-flex align-items-center gap-1">
                                            <FaUserShield /> 
                                        </Link>
                                    )}
                                    <Link to="/perfil" className="btn btn-success d-flex align-items-center gap-2 fw-bold text-white">
                                        <FaUserCircle size={20} />
                                        <span>Mi Perfil</span>
                                    </Link>
                                </div>
                            ) : (
                                // SI NO ESTÁ LOGUEADO: Muestra botón verde de Login
                                <Link to="/login" className="btn btn-success d-flex align-items-center gap-2 fw-bold">
                                    <FaSignInAlt />
                                    <span>Login</span>
                                </Link>
                            )}
                        </div> 
                    </div>
                </div>
            </div>
        </nav>
    );
}