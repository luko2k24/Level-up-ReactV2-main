import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { api } from '@/api/service';


export default function Header() {
    const navigate = useNavigate();
    const location = useLocation();

    // 1. Estados de autenticación (manteniendo tu lógica)
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    // 2. Efecto para verificar el estado y el rol
    useEffect(() => {
        const tokenChanged = api.Auth.isAuthenticated(); 
        setIsAuthenticated(tokenChanged);

        if (tokenChanged) {
            setIsAdmin(api.Auth.isAnAdmin()); 
        } else {
            setIsAdmin(false);
        }

        const handleStorageChange = () => {
            const currentAuth = api.Auth.isAuthenticated();
            setIsAuthenticated(currentAuth);
            if (currentAuth) {
                setIsAdmin(api.Auth.isAnAdmin());
            } else {
                setIsAdmin(false);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [isAuthenticated]); 

    // Función para cerrar sesión
    const handleLogout = () => {
        api.Auth.logout();
        setIsAuthenticated(false);
        navigate('/');
    };



    // --- Clases para los Links de Navegación (para que parezcan botones) ---
    const linkClasses = "nav-link btn btn-outline-light py-1 px-3 mx-1"; 

    // Función para aplicar la clase activa/estándar
    const getLinkClasses = (path: string) => {
        const isActive = location.pathname === path;
        const baseClasses = "nav-link btn btn-outline-light py-1 px-3 mx-1"; 
        return `${baseClasses} ${isActive ? 'custom-active' : ''}`;
    };


    // --- Renderizado JSX ---
    return (
        <nav className="navbar navbar-expand-lg navbar-dark navbar-glass sticky-top shadow-lg">
            
            <div className="container-fluid px-4"> 
                
                {/* 1. LOGO Y LINKS (BLOQUE IZQUIERDA) */}
                <Link to="/" className="navbar-brand me-4 text-decoration-none p-1 brand-main">
                    Level-Up<span className="brand-accent">Gamer</span>
                </Link>
                
                {/* Links de Navegación Estándar (Visibles en escritorio) */}
                <ul className="navbar-nav d-none d-lg-flex flex-row gap-2"> 
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

                {/* Botón de Hamburguesa para Móviles */}
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarNav" 
                    aria-controls="navbarNav" 
                    aria-expanded="false" 
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* 2. CONTENEDOR COLAPSABLE (BÚSQUEDA Y ACCIONES) */}
                <div className="collapse navbar-collapse" id="navbarNav">
                    
                    {/* B. Búsqueda y Acciones (Bloque Derecha) */}
                    <div className="d-flex align-items-center ms-auto"> 
                        
                        {/* Formulario de Búsqueda */}
                        <form className="d-flex me-3" role="search">
                            <input 
                                className="form-control" 
                                type="search" 
                                placeholder="Buscar productos..." 
                                aria-label="Search" 
                                style={{ maxWidth: '280px' }} 
                            />
                            <button className="btn btn-outline-light ms-2" type="submit">Buscar</button>
                        </form>
                        
                        {/* C. Botones de Acción (Carrito, Login) */}
                        <div className="d-flex align-items-center gap-2"> 
                            
                            {/* Carrito (SIN EL BADGE '99') */}
                            <Link to="/carrito" className="btn btn-outline-light position-relative p-1">
                                
                                
                                <i className="bi bi-cart-fill me-1"></i>
                                Carrito
                                
                
                                
                            </Link>
                            
                            {/* Botones de Auth (Login) */}
                            {isAuthenticated ? (
                                // Botones Autenticados
                                <div className="d-flex gap-2">
                                    {isAdmin && (
                                        <Link to="/admin" className="btn btn-primary fw-bold">Admin</Link>
                                    )}
                                    <button onClick={handleLogout} className="btn btn-outline-light">
                                        <i className="bi bi-person-fill fs-5"></i>
                                    </button>
                                </div>
                            ) : (
                                // Botones No Autenticados (SOLO Login)
                                <div className="d-flex">
                                    <Link to="/login" className="btn btn-outline-light">Login</Link>
                                </div>
                            )}
                        </div> 
                    </div>
                </div>

                {/* Botón de Hamburguesa (para la versión móvil) */}
                <button 
                    className="navbar-toggler d-lg-none" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarNav" 
                    aria-controls="navbarNav" 
                    aria-expanded="false" 
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                
            </div>
        </nav>
    );
}