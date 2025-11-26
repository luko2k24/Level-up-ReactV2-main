import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import React from "react";

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuthContext();

  // Evita redirección antes de restaurar sesión
  if (loading) return <div>Cargando...</div>;

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}
