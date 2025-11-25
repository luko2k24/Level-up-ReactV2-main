// src/pages/Perfil.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/api/service'; // 👈 Asegúrate que tu archivo en 'src/api' se llame 'index.ts'
import { FaUserCircle, FaSignOutAlt, FaIdBadge, FaUserTag } from 'react-icons/fa';

interface UserInfo {
  usuario: string;
  rol: string;
  exp: number;
}

export default function Perfil() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserInfo | null>(null);

  // Función para cerrar sesión
  const handleLogout = () => {
    api.Auth.logout();
    // Forzamos un evento de almacenamiento para que el Header se entere del cambio
    window.dispatchEvent(new Event('storage'));
    navigate('/login');
  };

  useEffect(() => {
    // 1. Seguridad
    if (!api.Auth.isAuthenticated()) {
      navigate('/login');
      return;
    }

    // 2. Decodificar Token
    const token = localStorage.getItem("jwt_token");
    if (token) {
      try {
        // Decodificación manual del Payload JWT
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const payload = JSON.parse(jsonPayload);

        setUser({
          usuario: payload.sub || 'Usuario',
          rol: payload.rol || 'Cliente',
          exp: payload.exp
        });

      } catch (e) {
        console.error("Error token inválido", e);
        handleLogout();
      }
    }
  }, [navigate]);

  if (!user) return <div className="text-center py-5 text-white">Cargando perfil...</div>;

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-lg border-0 rounded-3">
            
            {/* Encabezado azul */}
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

              {/* Botón Cerrar Sesión */}
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