import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaSearch,
  FaShoppingCart,
  FaUserCircle,
  FaSignInAlt,
  FaUserShield,
} from "react-icons/fa";
import { useAuthContext } from "@/context/AuthContext";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, user } = useAuthContext();

  // 🔥 ADMIN SIMPLE Y CORRECTO
  const isAdmin: boolean =
    isAuthenticated && user?.role === "ROLE_ADMIN";

  const getLinkClasses = (path: string): string => {
    const isActive = location.pathname === path;
    return `nav-link px-3 mx-1 fw-bold ${
      isActive
        ? "text-success border-bottom border-success"
        : "text-white opacity-75"
    }`;
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-lg">
      <div className="container-fluid px-4">
        {/* LOGO */}
        <Link
          to="/"
          className="navbar-brand me-5 d-flex align-items-center fw-bold fs-3 text-white"
        >
          <span className="text-success me-1">Level-Up</span>Gamer
        </Link>

        {/* MOBILE */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Abrir menú"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          {/* LINKS */}
          <ul className="navbar-nav me-auto mt-3 mt-lg-0">
            <li className="nav-item">
              <Link className={getLinkClasses("/")} to="/">
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={getLinkClasses("/categorias")}
                to="/categorias"
              >
                Categorías
              </Link>
            </li>
            <li className="nav-item">
              <Link className={getLinkClasses("/ofertas")} to="/ofertas">
                Ofertas
              </Link>
            </li>
          </ul>

          {/* DERECHA */}
          <div className="navbar-actions d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center gap-2 gap-lg-3 mt-3 mt-lg-0">
            {/* CARRITO */}
            <Link
              to="/carrito"
              className="btn btn-dark border border-secondary text-light d-flex align-items-center gap-2 justify-content-center justify-content-lg-start"
            >
              <FaShoppingCart className="text-success" />
              <span>Carrito</span>
            </Link>

            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <button
                    className="btn btn-warning fw-bold d-flex align-items-center gap-2 justify-content-center justify-content-lg-start"
                    onClick={() => navigate("/admin")}
                  >
                    <FaUserShield />
                    <span>Admin Panel</span>
                  </button>
                )}

                <button
                  className="btn btn-success fw-bold d-flex align-items-center gap-2 justify-content-center justify-content-lg-start"
                  onClick={() => navigate("/perfil")}
                >
                  <FaUserCircle />
                  <span>Mi Perfil</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="btn btn-success fw-bold d-flex align-items-center gap-2 justify-content-center justify-content-lg-start"
              >
                <FaSignInAlt />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
