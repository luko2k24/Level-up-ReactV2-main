// src/components/FormularioIngreso.tsx
import React, { useState, ChangeEvent, FormEvent, FC } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { api } from "@/api/service";
import type { LoginRequest } from "@/api/api";
import { useAuthContext } from "@/context/AuthContext";

function getRoleFromToken(token: string): string | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload?.role || payload?.rol || null;
  } catch {
    return null;
  }
}

const FormularioIngreso: FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthContext();

  const [nombreUsuario, setNombreUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const manejarEnvio = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const credentials: LoginRequest = {
      nombreUsuario: nombreUsuario.trim(),
      password: password.trim(),
    };

    try {
      // ✅ AXIOS RESPONSE
      const response = await api.Auth.login(credentials);

      // 🔴 AQUÍ ESTABA EL ERROR
      const token = response.data.token;

      if (!token) {
        console.error("Respuesta backend:", response.data);
        throw new Error("Backend no envió token");
      }

      const role = getRoleFromToken(token);

      login({
        user: { nombreUsuario, role },
        token,
      });

      navigate("/");
    } catch (err) {
      console.error("❌ Error login:", err);
      setError("Usuario o contraseña incorrectos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center py-5">
      <div className="card shadow-lg p-4 border-0" style={{ maxWidth: "400px" }}>
        <h2 className="text-center mb-4 text-primary fw-bold">
          Iniciar Sesión
        </h2>

        {error && <div className="alert alert-danger text-center">{error}</div>}

        <form onSubmit={manejarEnvio}>
          <div className="mb-3">
            <label className="form-label fw-bold">Nombre de Usuario</label>
            <input
              className="form-control"
              value={nombreUsuario}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setNombreUsuario(e.target.value)
              }
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold">Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-success w-100 fw-bold"
            disabled={loading}
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <hr />
          <p className="mb-0">
            ¿No tienes cuenta?{" "}
            <NavLink to="/register" className="fw-bold">
              Regístrate aquí
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FormularioIngreso;
