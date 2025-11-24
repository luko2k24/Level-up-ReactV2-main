import React, { useState, FormEvent } from 'react';
import { api } from '../api/service/index';
import { RegisterRequest } from '../api/api';

const regiones = [
  'Selecciona una región',
  'Metropolitana',
  'Valparaíso',
  'Biobío',
  'Antofagasta'
];

const FormularioRegistro = () => {

  const [form, setForm] = useState({
    nombreUsuario: '',
    nombreCompleto: '',
    edad: '',
    email: '',
    password: '',
    confirmarPassword: '',
    region: regiones[0],
    comuna: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const manejarEnvio = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.password !== form.confirmarPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (form.region === regiones[0]) {
      setError('Selecciona una región válida');
      return;
    }

    const data: RegisterRequest = {
      nombreUsuario: form.nombreUsuario,
      nombreCompleto: form.nombreCompleto,
      email: form.email,
      password: form.password,
      edad: parseInt(form.edad),
      region: form.region,
      comuna: form.comuna
    };

    try {
      await api.Auth.register(data);
      setSuccess('Registro exitoso');
    } catch (err: any) {
      setError('Error al registrar usuario');
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: '450px' }}>
      <h3 className="text-center mb-3">Registro</h3>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={manejarEnvio}>

        {/* nombreUsuario */}
        <div className="mb-3">
          <label className="form-label">Nombre de usuario</label>
          <input
            type="text"
            className="form-control"
            name="nombreUsuario"
            value={form.nombreUsuario}
            onChange={handleChange}
            required
          />
        </div>

        {/* nombreCompleto */}
        <div className="mb-3">
          <label className="form-label">Nombre completo</label>
          <input
            type="text"
            className="form-control"
            name="nombreCompleto"
            value={form.nombreCompleto}
            onChange={handleChange}
            required
          />
        </div>

        {/* edad */}
        <div className="mb-3">
          <label className="form-label">Edad</label>
          <input
            type="number"
            className="form-control"
            name="edad"
            value={form.edad}
            onChange={handleChange}
            required
          />
        </div>

        {/* email */}
        <div className="mb-3">
          <label className="form-label">Correo electrónico</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* password */}
        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* confirmar password */}
        <div className="mb-3">
          <label className="form-label">Confirmar contraseña</label>
          <input
            type="password"
            className="form-control"
            name="confirmarPassword"
            value={form.confirmarPassword}
            onChange={handleChange}
            required
          />
        </div>

        {/* region */}
        <div className="mb-3">
          <label className="form-label">Región</label>
          <select
            className="form-select"
            name="region"
            value={form.region}
            onChange={handleChange}
            required
          >
            {regiones.map((r, i) => (
              <option key={i} disabled={i === 0}>{r}</option>
            ))}
          </select>
        </div>

        {/* comuna */}
        <div className="mb-3">
          <label className="form-label">Comuna</label>
          <input
            type="text"
            className="form-control"
            name="comuna"
            value={form.comuna}
            onChange={handleChange}
            required
          />
        </div>

        <button className="btn btn-success w-100" type="submit">
          Registrarse
        </button>
      </form>
    </div>
  );
};

export default FormularioRegistro;
