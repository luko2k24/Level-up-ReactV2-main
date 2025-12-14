import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";

export default function AdminRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user, loading } = useAuthContext();

  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "ROLE_ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
