import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";

export default function AdminRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user, loading } = useAuthContext();

  const isAdmin = (() => {
    const role =
      user?.role ??
      user?.rol ??
      (Array.isArray(user?.roles) ? user?.roles?.[0] : undefined) ??
      (Array.isArray(user?.authorities) ? user?.authorities?.[0] : undefined) ??
      null;

    if (!role) return false;
    return role === 'ROLE_ADMIN' || role === 'ADMIN' || String(role).includes('ADMIN');
  })();

  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
