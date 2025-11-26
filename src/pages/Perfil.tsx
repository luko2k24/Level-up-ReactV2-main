import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaSignOutAlt, FaIdBadge, FaUserTag } from "react-icons/fa";
import { useAuthContext } from "@/context/AuthContext";

interface UserInfo {
  usuario: string;
  rol: string;
  exp?: number;
}

export default function Perfil() {
  const navigate = useNavigate();
  const { token, logout } = useAuthContext();
  const [user, setUser] = useState<UserInfo | null>(null);

  // Cierra sesión usando el contexto
  const handleLogout = () => {
    logout();
    // 🛑 CLAVE: Eliminamos window.dispatchEvent y solo navegamos.
    navigate("/login");
  };

  useEffect(() => {
    // Intentamos obtener el token: primero desde el contexto, si no, buscar claves antiguas en localStorage
    const rawToken = token ?? localStorage.getItem("token") ?? localStorage.getItem("jwt_token");

    // Si no hay token, redirigir al login
    if (!rawToken) {
      navigate("/login");
      return;
    }

    try {
      // Decodificar el payload del JWT de manera segura
      const base64Url = rawToken.split(".")[1];
      if (!base64Url) throw new Error("Token mal formado");
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const payload = JSON.parse(jsonPayload);

      setUser({
        usuario: (payload.sub as string) || (payload.username as string) || "Usuario",
        rol: (payload.rol as string) || (payload.role as string) || "Cliente",
        exp: payload.exp,
      });
    } catch (e) {
      console.error("Error al decodificar token:", e);
      // Token inválido: limpiar sesión y redirigir
      handleLogout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, navigate]);

  if (!user) return <div className="text-center py-5 text-white">Cargando perfil...</div>;

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-lg border-0 rounded-3">
            <div className="card-header bg-primary text-white text-center py-4">
              <FaUserCircle size={80} className="mb-2" />
              <h3 className="fw-bold mb-0">Hola, {user.usuario}</h3>
            </div>

            <div className="card-body p-4">
              <div className="list-group list-group-flush mb-4">
                <div className="list-group-item d-flex align-items-center py-3">
                  <FaIdBadge className="text-primary me-3" size={24} />
                  <div>
                    <small className="text-muted d-block">Usuario</small>
                    <span className="fw-bold fs-5">{user.usuario}</span>
                  </div>
                </div>

                <div className="list-group-item d-flex align-items-center py-3">
                  <FaUserTag className="text-primary me-3" size={24} />
                  <div>
                    <small className="text-muted d-block">Rol</small>
                    <span className="badge bg-info text-dark">{user.rol}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="btn btn-danger w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2"
              >
                <FaSignOutAlt /> Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}