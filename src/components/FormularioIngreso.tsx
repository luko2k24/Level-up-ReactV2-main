// src/components/FormularioIngreso.tsx
import React, { useState, ChangeEvent, FormEvent, FC } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { api } from "@/api/service/index";
import type { LoginRequest } from "@/api/api";
import { useAuthContext } from "@/context/AuthContext";

const FormularioIngreso: FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthContext();

  const [nombreUsuario, setNombreUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const manejarEnvio = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    setError("");
    setLoading(true);

    if (!nombreUsuario.trim() || !password.trim()) {
      setError("Ambos campos son requeridos.");
      setLoading(false);
      return;
    }

    const credentials: LoginRequest = { nombreUsuario, password };

    try {
      // 1️⃣ Llamada al backend
      const response = await api.Auth.login(credentials);

      console.log("LOGIN RESPONSE:", response);

      // 2️⃣ Extraer token (backend lo envía directo)
      const token = response?.token ?? null;

      if (!token) {
        throw new Error("Backend no envió token");
      }

      // 3️⃣ Backend NO envía user → lo creamos con el username ingresado
      const user = { nombreUsuario };

      // 4️⃣ Guardar en AuthContext + localStorage
      login({ user, token });

      // 5️⃣ Redirigir
      navigate("/");
    } catch (err) {
      console.error("❌ Error login:", err);
      setError("Usuario o contraseña incorrectos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center py-5"
      style={{ minHeight: "60vh" }}
    >
      <div
        className="card shadow-lg p-4 border-0"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <h2 className="text-center mb-4 text-primary fw-bold">
          Iniciar Sesión
        </h2>

        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={manejarEnvio}>
          <div className="mb-3">
            <label className="form-label fw-bold">Nombre de Usuario</label>
            <input
              type="text"
              className="form-control"
              value={nombreUsuario}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setNombreUsuario(e.target.value)
              }
              placeholder="Ej: gamer123"
              autoFocus
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
              placeholder="********"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-success w-100 py-2 fw-bold shadow-sm"
            disabled={loading}
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <hr />
          <p className="mb-0">
            ¿No tienes cuenta?{" "}
            <NavLink
              to="/register"
              className="text-decoration-none fw-bold text-primary"
            >
              Regístrate aquí
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FormularioIngreso;
