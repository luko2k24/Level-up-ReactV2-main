import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthContext();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return user?.rol === "admin" ? children : <Navigate to="/" replace />;
}
