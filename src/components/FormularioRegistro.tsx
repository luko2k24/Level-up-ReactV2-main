import React, { useState, FormEvent } from 'react';
import { api } from '../api/service/index';
import { RegisterRequest } from '../api/api';
import '../styles/FormularioRegistro.css';

const regiones = [
  'Selecciona una región',
  'Metropolitana',
  'Valparaíso',
  'Biobío',
  'Antofagasta'
];

const FormularioRegistro = () => {
  // ... (Estado y funciones de manejo quedan igual)

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

    // El objeto de datos (data) que se envía al backend es correcto
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
      // Intentamos obtener el mensaje de error del backend (ej. "El nombre de usuario ya existe.")
      const errorMsg = err.response?.data?.mensaje || 'Error al registrar usuario';
      setError(errorMsg);
    }
  };

  return (
    // Se usa la clase principal del CSS
    <div className="formulario-registro"> 
      <h2>Registro</h2>

      {/* Uso de las clases .error y .success */}
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <form onSubmit={manejarEnvio}>

        {/* nombreUsuario */}
        <div className="input-group">
          <label htmlFor="nombreUsuario">Nombre de usuario</label>
          <input
            type="text"
            id="nombreUsuario"
            name="nombreUsuario"
            value={form.nombreUsuario}
            onChange={handleChange}
            required
          />
        </div>

        {/* nombreCompleto */}
        <div className="input-group">
          <label htmlFor="nombreCompleto">Nombre completo</label>
          <input
            type="text"
            id="nombreCompleto"
            name="nombreCompleto"
            value={form.nombreCompleto}
            onChange={handleChange}
            required
          />
        </div>

        {/* edad */}
        <div className="input-group">
          <label htmlFor="edad">Edad</label>
          <input
            type="number"
            id="edad"
            name="edad"
            value={form.edad}
            onChange={handleChange}
            required
          />
        </div>

        {/* email */}
        <div className="input-group">
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* password */}
        <div className="input-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* confirmar password */}
        <div className="input-group">
          <label htmlFor="confirmarPassword">Confirmar contraseña</label>
          <input
            type="password"
            id="confirmarPassword"
            name="confirmarPassword"
            value={form.confirmarPassword}
            onChange={handleChange}
            required
          />
        </div>

        {/* region */}
        <div className="input-group">
          <label htmlFor="region">Región</label>
          <select
            id="region"
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
        <div className="input-group">
          <label htmlFor="comuna">Comuna</label>
          <input
            type="text"
            id="comuna"
            name="comuna"
            value={form.comuna}
            onChange={handleChange}
            required
          />
        </div>

        {/* Uso de la clase del botón */}
        <button className="btn-registrar" type="submit">
          Registrarse
        </button>
      </form>
    </div>
  );
};

export default FormularioRegistro;